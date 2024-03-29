const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const moment = require('moment');
const { AgoraAppId } = require('../../models/AgoraAppId.model');
const axios = require('axios');

const {
  DemoPost,
  DemoUser,
  Demobuyer,
  DemostreamToken,
  DemoInstested,
  Demootpverify,
  Democloudrecord,
  MutibleDemo,
} = require('../../models/demo.realestate.model');
const jwt = require('jsonwebtoken');
const agoraToken = require('../AgoraAppId.service');

const Agora = require('agora-access-token');

const getDatas = async () => {
  let stream = await DemostreamToken.aggregate([
    {
      $match: { channel: '30fa154efe' },
    },
    {
      $lookup: {
        from: 'demobuyers',
        localField: 'userID',
        foreignField: '_id',
        pipeline: [
          {
            $addFields: {
              id: {
                $convert: {
                  input: '$phoneNumber',
                  to: 'string',
                  onError: 0,
                },
              },
            },
          },
          {
            $lookup: {
              from: 'climbeventregisters',
              localField: 'id',
              foreignField: 'mobileNumber',
              as: 'asas',
            },
          },
        ],
        as: 'demoBuyers',
      },
    },
    {
      $unwind: {
        path: '$demoBuyers',
      },
    },
  ]);
  return stream;
};

const get_stream_details = async (req) => {
  let stream = await DemoPost.findById(req.query.id);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }

  stream = await DemoPost.aggregate([
    { $match: { $and: [{ _id: { $eq: stream._id } }] } },
    {
      $lookup: {
        from: 'demousers',
        localField: 'userId',
        foreignField: '_id',
        as: 'demousers',
      },
    },
    {
      $unwind: '$demousers',
    },
    {
      $lookup: {
        from: 'demostreamhis',
        localField: 'runningStream',
        foreignField: '_id',
        as: 'demostreamhis',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$demostreamhis',
      },
    },
    {
      $project: {
        _id: 1,
        imageArr: 1,
        status: 1,
        newsPaper: 1,
        Edition: 1,
        dateOfAd: 1,
        createdAt: 1,
        updatedAt: 1,
        image: 1,
        Description: 1,
        bhkBuilding: 1,
        category: 1,
        furnitionStatus: 1,
        location: 1,
        postType: 1,
        priceExp: 1,
        propertyType: 1,
        linkstatus: 1,
        tenantType: 1,
        ageOfProperty: 1,
        otp_verifiyed: 1,
        finish: 1,
        streamDate: 1,
        sqft: 1,
        userName: '$demousers.userName',
        mobileNumber: '$demousers.mobileNumber',
        locationss: '$demousers.location',
        mail: '$demousers.mail',
        start: '$demostreamhis.start',
        end: '$demostreamhis.end',
        actualEnd: '$demostreamhis.actualEnd',
        streamStatus: '$demostreamhis.status',
        agoraAppId: '$demostreamhis.agoraAppId',
        streamID: '$demostreamhis._id',
        sqft: 1,
      },
    },
  ]);
  if (stream.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  return stream[0];
};

const send_otp = async (req) => {
  console.log(req.query.id);
  let stream = await DemoPost.findById(req.query.id);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }

  let res = await send_otp_now(stream);
  return res;
};

const verify_otp = async (req) => {
  let { otp, id } = req.body;
  const token = await DemoPost.findById(id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }

  let Datenow = new Date().getTime();
  let verify = await Demootpverify.findOne({
    streamID: id,
    OTP: otp,
    verify: false,
    expired: false,
    otpExpiedTime: { $gt: Datenow },
  });
  if (!verify) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP');
  } else {
    verify.verify = true;
    verify.expired = true;
    verify.save();
    const stream = await DemoPost.findById(verify.streamID);
    stream.otp_verifiyed = verify._id;
    stream.linkstatus = 'Verified';
    stream.save();
  }
  return verify;
};

const send_otp_now = async (stream) => {
  let OTPCODE = Math.floor(100000 + Math.random() * 900000);
  let Datenow = new Date().getTime();
  let otpsend = await Demootpverify.findOne({
    streamID: stream._id,
    otpExpiedTime: { $gte: Datenow },
    verify: false,
    expired: false,
  });
  if (!otpsend) {
    const token = await DemoUser.findById(stream.userId);
    await Demootpverify.updateMany(
      { streamID: stream._id, verify: false },
      { $set: { verify: true, expired: true } },
      { new: true }
    );
    let exp = moment().add(5, 'minutes');
    let otp = await Demootpverify.create({
      OTP: OTPCODE,
      verify: false,
      mobile: token.mobileNumber,
      streamID: stream._id,
      DateIso: moment(),
      userID: stream.userId,
      expired: false,
      otpExpiedTime: exp,
    });
    let message = `${OTPCODE}  is the Onetime password(OTP) for mobile number verification . This is usable once and valid for 5 minutes from the request- India Property Expo(An Ookam company expo)`;
    let reva = await axios.get(
      `http://panel.smsmessenger.in/api/mt/SendSMS?user=ookam&password=ookam&senderid=OOKAMM&channel=Trans&DCS=0&flashsms=0&number=${token.mobileNumber}&text=${message}&route=6&peid=1701168700339760716&DLTTemplateId=1707170322910143638`
    );
    console.log(reva.data);
    otpsend = { otpExpiedTime: otp.otpExpiedTime };
  } else {
    otpsend = { otpExpiedTime: otpsend.otpExpiedTime };
  }
  return otpsend;
};

const select_data_time = async (req) => {
  let { date, id, verify } = req.body;
  const token = await DemoPost.findById(id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  if (token.otp_verifiyed != verify) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Access');
  }
  // if (token.status == 'Completed' || token.status == 'OnGoing') {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Time Already Selected');
  // }

  let history = await MutibleDemo.updateMany(
    { streamId: token._id, status: { $in: ['Pending', 'OnGoing'] } },
    { status: 'Completed', end: new Date().getTime() }
  );

  let start = new Date(date).getTime();
  let end = new Date(moment(date).add(30, 'minutes')).getTime();

  history = await MutibleDemo.create({
    streamId: token._id,
    start: start,
    end: end,
    actualEnd: end,
  });
  token.runningStream = history._id;
  token.status = 'Scheduled';
  token.save();

  return history;
};

const add_one_more_time = async (req) => {
  let { post } = req.body;
  const token = await DemoPost.findById(post);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  let his = await MutibleDemo.findById(token.runningStream);

  if (his) {
    if (his.status != 'Completed') {
      his.status = 'Restream';
    }
    his.save();
  }
  token.status = 'Pending';
  token.save();
  return token;
};

const end_stream = async (req) => {
  let value = await DemoPost.findByIdAndUpdate(
    { _id: req.query.id },
    { status: 'Completed', streamEnd_Time: moment(), userList: [], end_Status: 'HostLeave' },
    { new: true }
  );
  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }

  let his = await MutibleDemo.findById(value.runningStream);
  if (!his) {
    throw new ApiError(httpStatus.NOT_FOUND, 'History not found');
  }
  his.status = 'Completed';
  his.end = new Date().getTime();
  his.save();

  value.runningStream = null;
  value.save();

  req.io.emit(his._id + '_stream_end', { value: true });
  return value;
};

const seller_go_live = async (req) => {
  let { post } = req.body;
  const token = await DemoPost.findById(post);
  const uid = await generateUid();
  const role = Agora.RtcRole.PUBLISHER;
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  let his = await MutibleDemo.findById(token.runningStream);
  if (!his) {
    throw new ApiError(httpStatus.NOT_FOUND, 'History not found');
  }
  if (his.agoraAppId == null) {
    let agoraID = await agoraToken.token_assign(1500, his._id, 'demo');
    if (agoraID) {
      his.agoraAppId = agoraID.element._id;
      his.save();
    }
  }

  if (token.status == 'Ready') {
    let expirationTimestamp = moment(his.end) / 1000;
    const agrotoken = await geenerate_rtc_token(his._id, uid, role, expirationTimestamp, his.agoraAppId);
    let demotoken = await DemostreamToken.findOne({ type: 'HOST', channel: his._id });
    if (!demotoken) {
      demotoken = await DemostreamToken.create({
        expirationTimestamp: expirationTimestamp * 1000,
        streamID: token._id,
        type: 'HOST',
        uid: uid,
        agoraID: his.agoraAppId,
        token: agrotoken,
        channel: his._id,
        dateISO: moment(),
        userID: token.userId,
      });
      token.status = 'On-Going';
      token.save();
      req.io.emit(his._id + 'stream_on_going', token);
    }
  }

  await cloude_recording_stream(token._id, his.agoraAppId, his.end);

  return token;
};
const seller_go_live_details = async (req) => {
  let { id } = req.query;
  const token = await DemoPost.findById(id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  let his = await MutibleDemo.findById(token.runningStream);
  if (!his) {
    throw new ApiError(httpStatus.NOT_FOUND, 'History not found');
  }

  const streampost = await DemoPost.aggregate([
    { $match: { $and: [{ _id: { $eq: token._id } }] } },
    {
      $lookup: {
        from: 'demousers',
        localField: 'userId',
        foreignField: '_id',
        as: 'demousers',
      },
    },
    {
      $unwind: '$demousers',
    },
    {
      $lookup: {
        from: 'demostreamhis',
        localField: 'runningStream',
        pipeline: [
          {
            $lookup: {
              from: 'demostreamtokens',
              localField: '_id',
              foreignField: 'channel',
              pipeline: [{ $match: { $and: [{ type: { $eq: 'HOST' } }] } }],
              as: 'demostreamtokens',
            },
          },
          {
            $unwind: '$demostreamtokens',
          },
          {
            $lookup: {
              from: 'agoraappids',
              localField: 'agoraAppId',
              foreignField: '_id',
              as: 'agoraappids',
            },
          },
          {
            $unwind: '$agoraappids',
          },
        ],
        foreignField: '_id',
        as: 'demostreamhis',
      },
    },
    {
      $unwind: '$demostreamhis',
    },
    {
      $lookup: {
        from: 'demointresteds',
        localField: 'runningStream',
        foreignField: 'streamID',
        pipeline: [{ $match: { $and: [{ intrested: { $eq: true } }] } }, { $group: { _id: null, count: { $sum: 1 } } }],
        as: 'demointresteds',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$demointresteds',
      },
    },
    {
      $addFields: {
        intrested: { $ifNull: ['$demointresteds.count', 0] },
      },
    },
    {
      $project: {
        _id: 1,
        imageArr: 1,
        status: 1,
        newsPaper: 1,
        Edition: 1,
        dateOfAd: 1,
        createdAt: 1,
        updatedAt: 1,
        image: 1,
        Description: 1,
        bhkBuilding: 1,
        category: 1,
        furnitionStatus: 1,
        location: 1,
        postType: 1,
        priceExp: 1,
        propertyType: 1,
        linkstatus: 1,
        tenantType: 1,
        ageOfProperty: 1,
        otp_verifiyed: 1,
        finish: 1,
        streamDate: 1,
        userName: '$demousers.userName',
        mobileNumber: '$demousers.mobileNumber',
        locationss: '$demousers.location',
        mail: '$demousers.mail',
        start: '$demostreamhis.start',
        end: '$demostreamhis.end',
        actualEnd: '$demostreamhis.actualEnd',
        streamStatus: '$demostreamhis.status',
        agoraAppId: '$demostreamhis.agoraAppId',
        agora: '$demostreamhis.agoraappids',
        stream: '$demostreamhis.demostreamtokens',
        streamID: '$demostreamhis._id',
        current_watching_stream: '$demostreamhis.current_watching_stream',
        intrested: 1,
        sqft: 1,
      },
    },
  ]);

  if (streampost.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  return streampost[0];
};
const start_cloud = async (req) => {
  let start = await recording_start(req.query.post);
  return start;
};

const geenerate_rtc_token = async (chennel, uid, role, expirationTimestamp, agoraID) => {
  let agoraToken = await AgoraAppId.findById(agoraID);
  return Agora.RtcTokenBuilder.buildTokenWithUid(
    agoraToken.appID.replace(/\s/g, ''),
    agoraToken.appCertificate.replace(/\s/g, ''),
    chennel,
    uid,
    role,
    expirationTimestamp
  );
};
const generateUid = async () => {
  const length = 5;
  const randomNo = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
  return randomNo;
};

const cloude_recording_stream = async (stream, app, endTime) => {
  const stremRequiest = await DemoPost.findById(stream);
  let his = await MutibleDemo.findById(stremRequiest.runningStream);

  let agoraToken = await AgoraAppId.findById(app);
  let record = await Democloudrecord.findOne({ chennel: his._id, recoredStart: { $eq: 'acquire' } });
  if (!record) {
    record = await Democloudrecord.findOne({ chennel: his._id, recoredStart: { $in: ['query', 'start'] } });
    if (record) {
      let token = record;
      const resource = token.resourceId;
      const sid = token.sid;
      const mode = 'mix';
      const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString('base64')}`;
      await axios
        .get(
          `https://api.agora.io/v1/apps/${agoraToken.appID.replace(
            /\s/g,
            ''
          )}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`,
          { headers: { Authorization } }
        )
        .then((res) => {})
        .catch(async (error) => {
          console.log('error');
          await Democloudrecord.findByIdAndUpdate({ _id: record._id }, { recoredStart: 'stop' }, { new: true });
          const uid = await generateUid();
          const role = Agora.RtcRole.SUBSCRIBER;
          const expirationTimestamp = endTime / 1000;
          const token = await geenerate_rtc_token(his._id, uid, role, expirationTimestamp, his.agoraAppId);
          record = await Democloudrecord.create({
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('HHMMSS'),
            created: moment(),
            Uid: uid,
            chennel: his._id,
            created_num: new Date().getTime(),
            expDate: expirationTimestamp * 1000,
            type: 'CloudRecording',
            token: token,
            store: record._id.replace(/[^a-zA-Z0-9]/g, ''),
            streamId: stremRequiest._id,
          });
          record.save();
          await agora_acquire(record._id, agoraToken);
        });
    } else {
      await Democloudrecord.updateMany({ chennel: his._id }, { recoredStart: 'stop' }, { new: true });
      const uid = await generateUid();
      const role = Agora.RtcRole.SUBSCRIBER;
      const expirationTimestamp = endTime / 1000;
      const token = await geenerate_rtc_token(his._id, uid, role, expirationTimestamp, agoraToken._id);
      console.log(stremRequiest);
      record = await Democloudrecord.create({
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HHMMSS'),
        created: moment(),
        Uid: uid,
        chennel: his._id,
        created_num: new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime(),
        expDate: expirationTimestamp * 1000,
        type: 'CloudRecording',
        token: token,
        streamId: stremRequiest._id,
      });
      console.log(record);

      record.store = record._id.replace(/[^a-zA-Z0-9]/g, '');
      record.save();
      await agora_acquire(record._id, agoraToken);
      await Democloudrecord.findByIdAndUpdate(
        { _id: record._id },
        { store: record._id.replace(/[^a-zA-Z0-9]/g, '') },
        { new: true }
      );
    }
  } else {
    return { start: 'Already acquired' };
  }
};

const agora_acquire = async (id, agroaID) => {
  let temtoken = id;
  let agoraToken = agroaID;
  // let temtoken=req.body.id;
  let token = await Democloudrecord.findById(temtoken);
  const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString('base64')}`;
  const acquire = await axios.post(
    `https://api.agora.io/v1/apps/${agoraToken.appID.replace(/\s/g, '')}/cloud_recording/acquire`,
    {
      cname: token.chennel,
      uid: token.Uid.toString(),
      clientRequest: {
        resourceExpiredHour: 24,
        scene: 0,
      },
    },
    { headers: { Authorization } }
  );
  token.resourceId = acquire.data.resourceId;
  token.recoredStart = 'acquire';
  token.save();
};

const recording_start = async (id) => {
  const stremRequiest = await DemoPost.findById(id);
  let his = await MutibleDemo.findById(stremRequiest.runningStream);
  let token = await Democloudrecord.findOne({ chennel: stremRequiest.runningStream, recoredStart: { $eq: 'acquire' } });
  if (token) {
    let agoraToken = await AgoraAppId.findById(his.agoraAppId);
    const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString('base64')}`;
    if (token.recoredStart == 'acquire') {
      console.log('start', agoraToken, token);
      const resource = token.resourceId;
      const mode = 'mix';
      const start = await axios.post(
        `https://api.agora.io/v1/apps/${agoraToken.appID.replace(
          /\s/g,
          ''
        )}/cloud_recording/resourceid/${resource}/mode/${mode}/start`,
        {
          cname: token.chennel,
          uid: token.Uid.toString(),
          clientRequest: {
            token: token.token,
            recordingConfig: {
              maxIdleTime: 30,
              streamTypes: 2,
              channelType: 1,
              videoStreamType: 0,
              transcodingConfig: {
                height: 640,
                width: 1080,
                bitrate: 1000,
                fps: 15,
                mixedVideoLayout: 1,
                backgroundColor: '#FFFFFF',
              },
            },
            recordingFileConfig: {
              avFileType: ['hls', 'mp4'],
            },
            storageConfig: {
              vendor: 1,
              region: 14,
              bucket: 'streamingupload',
              accessKey: 'AKIA3323XNN7Y2RU77UG',
              secretKey: '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',
              fileNamePrefix: [token.store, token.Uid.toString()],
            },
          },
        },
        { headers: { Authorization } }
      );
      token.resourceId = start.data.resourceId;
      token.sid = start.data.sid;
      token.recoredStart = 'start';
      token.save();
      setTimeout(async () => {
        await recording_query(token._id, agoraToken);
      }, 3000);
      return start.data;
    } else {
      return { message: 'Already Started' };
    }
  } else {
    return { message: 'Already Started' };
  }
};
const recording_query = async (id, agoraToken) => {
  const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString('base64')}`;
  let temtoken = id;
  // let temtoken=req.body.id;
  // //console.log(req.body);
  let token = await Democloudrecord.findById(temtoken);
  const resource = token.resourceId;
  const sid = token.sid;
  const mode = 'mix';
  // //console.log(`https://api.agora.io/v1/apps/${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`);
  const query = await axios.get(
    `https://api.agora.io/v1/apps/${agoraToken.appID.replace(
      /\s/g,
      ''
    )}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`,
    { headers: { Authorization } }
  );
  // console.log(query.data);
  console.log(query.data.serverResponse.fileList);
  if (query.data.serverResponse != null) {
    if (query.data.serverResponse.fileList != null) {
      if (query.data.serverResponse.fileList.length != 0) {
        if (Array.isArray(query.data.serverResponse.fileList)) {
          token.videoLink = query.data.serverResponse.fileList[0].fileName;
          token.videoLink_obj = query.data.serverResponse.fileList;
          let m3u8 = query.data.serverResponse.fileList[0].fileName;
          if (m3u8 != null) {
            let mp4 = m3u8.replace('.m3u8', '_0.mp4');
            token.videoLink_mp4 = mp4;
          }
          token.recoredStart = 'query';
          token.save();
          console.log(token, 987657);
        } else {
          token.videoLink = query.data.serverResponse.fileList.fileName;
          let m3u8 = query.data.serverResponse.fileList.fileName;
          if (m3u8 != null) {
            let mp4 = m3u8.replace('.m3u8', '_0.mp4');
            token.videoLink_mp4 = mp4;
          }
          token.recoredStart = 'query';
          token.save();
        }
      }
    }
  }

  // if (query.data.serverResponse.fileList.length > 0) {
  //   token.videoLink = query.data.serverResponse.fileList[0].fileName;
  //   token.videoLvideoLink_objink = query.data.serverResponse.fileList;
  //   token.recoredStart = 'query';
  //   token.save();
  // }
  return query.data;
};

const buyer_join_stream = async (req) => {
  const { phoneNumber, name } = req.body;
  const streamId = req.query.id;

  let user = await Demobuyer.findOne({ phoneNumber: phoneNumber });

  if (!user) {
    user = await Demobuyer.create({ phoneNumber: phoneNumber, name: name, dateISO: moment() });
  } else {
    user.name = name;
    user.save();
  }

  const stream = await MutibleDemo.findById(streamId);
  const post = await DemoPost.findById(stream.streamId);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  // if (stream.status == 'Completed' || ) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Stream Completed');
  // }
  let demotoken = await DemostreamToken.findOne({ userID: user._id, streamID: stream._id });
  if (!demotoken) {
    demotoken = await DemostreamToken.create({
      streamID: streamId,
      type: 'BUYER',
      agoraID: stream.agoraID,
      channel: streamId,
      dateISO: moment(),
      userID: user._id,
      demoPost: stream.streamId,
    });
  }

  let register = await DemostreamToken.find({ streamID: demotoken.streamID, status: 'resgistered' }).count();
  if (register < 300) {
    demotoken.golive = true;
    if (post.status == 'Scheduled') {
      post.status = 'Ready';
      post.save();
      stream.status = 'Ready';
      stream.save();
    }
  } else {
    demotoken.golive = false;
  }
  demotoken.status = 'resgistered';
  demotoken.save();

  setTimeout(async () => {
    register = await DemostreamToken.find({ streamID: demotoken.streamID, status: 'resgistered' }).count();
    req.io.emit(demotoken.streamID + '_buyer_registor', { register, stream });
  }, 300);
  return demotoken;
};

const get_buyer_join_stream = async (req) => {
  const { streamID, verify } = req.body;

  let token = await DemostreamToken.findById(verify);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream Not Found');
  }
  if (token.streamID != streamID) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream Not Found');
  }

  let stream = await MutibleDemo.findById(streamID);
  if (!stream) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream Completed');
  }

  let post = await DemoPost.aggregate([
    { $match: { $and: [{ _id: { $eq: token.demoPost } }] } },
    {
      $lookup: {
        from: 'demousers',
        localField: 'userId',
        foreignField: '_id',
        as: 'demousers',
      },
    },
    {
      $unwind: '$demousers',
    },
    {
      $lookup: {
        from: 'demostreamhis',
        localField: 'runningStream',
        foreignField: '_id',
        as: 'demostreamhis',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$demostreamhis',
      },
    },
    {
      $project: {
        _id: 1,
        imageArr: 1,
        status: 1,
        newsPaper: 1,
        Edition: 1,
        dateOfAd: 1,
        createdAt: 1,
        updatedAt: 1,
        image: 1,
        Description: 1,
        bhkBuilding: 1,
        category: 1,
        furnitionStatus: 1,
        location: 1,
        postType: 1,
        priceExp: 1,
        propertyType: 1,
        linkstatus: 1,
        tenantType: 1,
        ageOfProperty: 1,
        otp_verifiyed: 1,
        finish: 1,
        streamDate: 1,
        userName: '$demousers.userName',
        mobileNumber: '$demousers.mobileNumber',
        locationss: '$demousers.location',
        mail: '$demousers.mail',
        start: '$demostreamhis.start',
        end: '$demostreamhis.end',
        actualEnd: '$demostreamhis.actualEnd',
        streamStatus: '$demostreamhis.status',
        agoraAppId: '$demostreamhis.agoraAppId',
        streamID: '$demostreamhis._id',
        sqft: 1,
      },
    },
  ]);

  if (post.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  return { post: post[0], token, stream };
};

const buyer_go_live_stream = async (req) => {
  let demotoken = await DemostreamToken.findById(req.query.id);
  if (!demotoken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  const stream = await MutibleDemo.findById(demotoken.streamID);
  console.log(stream);
  if (stream) {
    if (demotoken.token == null && stream.agoraAppId != null) {
      const uid = await generateUid();
      const role = Agora.RtcRole.SUBSCRIBER;
      let expirationTimestamp = stream.end / 1000;
      const token = await geenerate_rtc_token(stream._id, uid, role, expirationTimestamp, stream.agoraAppId);
      demotoken.expirationTimestamp = stream.end;
      demotoken.uid = uid;
      demotoken.token = token;
      demotoken.save();
    }
  }
  return demotoken;
};

const byer_get_stream_details = async (req) => {
  let demotoken = await DemostreamToken.findById(req.query.id);
  if (!demotoken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  const stream = await MutibleDemo.findById(demotoken.streamID);
  const agora = await AgoraAppId.findById(stream.agoraAppId);

  let post = await DemoPost.aggregate([
    { $match: { $and: [{ _id: { $eq: stream.streamId } }] } },
    {
      $lookup: {
        from: 'demousers',
        localField: 'userId',
        foreignField: '_id',
        as: 'demousers',
      },
    },
    {
      $unwind: '$demousers',
    },
    {
      $lookup: {
        from: 'demointresteds',
        localField: 'runningStream',
        foreignField: 'streamID',
        pipeline: [{ $match: { $and: [{ joinedUSER: { $eq: demotoken._id } }] } }],
        as: 'demointresteds',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$demointresteds',
      },
    },
    {
      $addFields: {
        intrested: { $ifNull: ['$demointresteds.intrested', false] },
      },
    },
    {
      $project: {
        _id: 1,
        imageArr: 1,
        status: 1,
        newsPaper: 1,
        Edition: 1,
        dateOfAd: 1,
        createdAt: 1,
        updatedAt: 1,
        image: 1,
        Description: 1,
        bhkBuilding: 1,
        category: 1,
        furnitionStatus: 1,
        location: 1,
        postType: 1,
        priceExp: 1,
        propertyType: 1,
        linkstatus: 1,
        tenantType: 1,
        ageOfProperty: 1,
        otp_verifiyed: 1,
        finish: 1,
        streamDate: 1,
        userName: '$demousers.userName',
        mobileNumber: '$demousers.mobileNumber',
        locationss: '$demousers.location',
        mail: '$demousers.mail',
        intrested: 1,
        sqft: 1,
        // demointresteds:"$demointresteds",
        // runningStream:1
      },
    },
  ]);

  if (post.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  return { post: post[0], stream, agora, demotoken };
};

const buyer_interested = async (req) => {
  let demotoken = await DemostreamToken.findById(req.body.id);
  if (!demotoken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }

  let instrest = await DemoInstested.findOne({
    // streamID: demotoken.streamID,
    streamHis: demotoken.demoPost,
    userID: demotoken.userID,
    joinedUSER: demotoken._id,
  });
  console.log(instrest, 98798);
  if (!instrest) {
    instrest = await DemoInstested.create({
      streamID: demotoken.streamID,
      streamHis: demotoken.demoPost,
      userID: demotoken.userID,
      joinedUSER: demotoken._id,
      intrested: true,
    });
  } else {
    instrest.intrested = !instrest.intrested;
    instrest.save();
  }
  setTimeout(async () => {
    let count = await DemoInstested.find({
      streamID: demotoken.streamID,
      streamHis: demotoken.demoPost,
      intrested: true,
    }).count();
    req.io.emit(demotoken.streamID + '_interest_count', { value: count });
  }, 400);
  return instrest;
};

const getStreamDetails = async (req) => {
  let id = req.params.id;
  let post = await MutibleDemo.aggregate([
    {
      $match: {
        streamId: id,
      },
    },
    {
      $lookup: {
        from: 'demoposts',
        localField: 'streamId',
        foreignField: '_id',
        as: 'post',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$post',
      },
    },
    {
      $lookup: {
        from: 'demostreamtokens',
        localField: '_id',
        foreignField: 'channel',
        pipeline: [{ $match: { type: 'BUYER' } }],
        as: 'View',
      },
    },
    {
      $lookup: {
        from: 'demointresteds',
        localField: '_id',
        foreignField: 'streamID',
        pipeline: [{ $match: { intrested: true } }],
        as: 'intrest',
      },
    },
    {
      $project: {
        _id: 1,
        createdDate: '$createdAt',
        streamDate: '$start',
        streamStatus: '$status',
        linkStatus: '$post.linkstatus',
        view: { $size: '$View' },
        intrest: { $size: '$intrest' },
        status: '$post.status',
      },
    },
  ]);
  return post;
};

const getViewAndIntrestedUsersByStream = async (req) => {
  let id = req.params.id;
  const values = await MutibleDemo.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $lookup: {
        from: 'demostreamtokens',
        localField: '_id',
        foreignField: 'channel',
        pipeline: [
          { $match: { type: 'BUYER' } },
          {
            $lookup: {
              from: 'demointresteds',
              localField: '_id',
              foreignField: 'joinedUSER',
              pipeline: [{ $match: { intrested: true } }],
              as: 'intrest',
            },
          },
          {
            $unwind: { path: '$intrest', preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: 'demobuyers',
              localField: 'userID',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
          },
          {
            $project: {
              _id: 1,
              streamID: 1,
              intrest: { $ifNull: ['$intrest.intrested', false] },
              userName: { $ifNull: ['$user.name', 'user Deleted'] },
              UserNumber: { $ifNull: ['$user.phoneNumber', 'user Deleted'] },
            },
          },
        ],
        as: 'View',
      },
    },
    {
      $project: {
        users: '$View',
      },
    },
  ]);
  return values;
};

const get_cloud = async (req) => {
  let id = req.query.id;
  let cloud = await Democloudrecord.aggregate([
    { $match: { $and: [{ chennel: { $eq: id } }, { videoLink_mp4: { $ne: null } }] } },
  ]);

  return cloud;
};

module.exports = {
  getDatas,
  get_stream_details,
  send_otp,
  verify_otp,
  select_data_time,
  add_one_more_time,
  seller_go_live,
  seller_go_live_details,
  start_cloud,
  end_stream,
  buyer_join_stream,
  get_buyer_join_stream,
  buyer_go_live_stream,
  byer_get_stream_details,
  buyer_interested,
  getStreamDetails,
  getViewAndIntrestedUsersByStream,
  get_cloud,
};
