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
  MutibleDemo
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
        localField: '_id',
        foreignField: 'streamId',
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
        "imageArr": 1,
        "status": 1,
        "newsPaper": 1,
        "Edition": 1,
        "dateOfAd": 1,
        "createdAt": 1,
        "updatedAt": 1,
        "image": 1,
        "Description": 1,
        "bhkBuilding": 1,
        "category": 1,
        "furnitionStatus": 1,
        "location": 1,
        "postType": 1,
        "priceExp": 1,
        "propertyType": 1,
        userName: "$demousers.userName",
        mobileNumber: "$demousers.mobileNumber",
        location: "$demousers.location",
        mail: "$demousers.mail",
        start: "$demostreamhis.start",
        end: "$demostreamhis.end",
        actualEnd: "$demostreamhis.actualEnd",
        streamStatus: "$demostreamhis.status",
        agoraAppId: "$demostreamhis.agoraAppId"
      }
    }
  ])
  if (stream.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Stream not found');
  }
  return stream[0];
};

const send_otp = async (req) => {
  console.log(req.query.id)
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
    let exp = moment().add(3, 'minutes');
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
    let message = `Dear ${token.userName},thank you for the registration to the event AgriExpoLive2023 .Your OTP for logging into the account is ${OTPCODE}- AgriExpoLive2023(An Ookam company event)`;
    let reva = await axios.get(
      `http://panel.smsmessenger.in/api/mt/SendSMS?user=ookam&password=ookam&senderid=OOKAMM&channel=Trans&DCS=0&flashsms=0&number=${token.mobileNumber}&text=${message}&route=6&peid=1701168700339760716&DLTTemplateId=1707168958877302526`
    );
    console.log(reva.data);
    otpsend = { otpExpiedTime: otp.otpExpiedTime };
  } else {
    otpsend = { otpExpiedTime: otpsend.otpExpiedTime };
  }
  return otpsend;
};




const select_data_time = async (req) => {
  let { date, id, verify, } = req.body;
  console.log(7689, date, id, verify)
  const token = await DemoPost.findById(id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  if (token.otp_verifiyed != verify) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Access');
  }
  if (token.status == 'Completed' || token.status == 'OnGoing') {
    throw new ApiError(httpStatus.NOT_FOUND, 'Time Already Selected');
  }

  let history = await MutibleDemo.findOne({ streamId: token._id, status: { $in: ['Pending', 'OnGoing'] } });

  if (!history) {

    let start = new Date(date).getTime();
    let end = new Date(moment(date).add(30, 'minutes')).getTime();

    history = await MutibleDemo.create({
      streamId: token._id,
      start: start,
      end: end,
      actualEnd: end
    })
    token.runningStream = history._id;
    token.status = 'Scheduled';
    token.save();
  }
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
      // req.io.emit(token._id + 'stream_on_going', demostream);
    }

    // await cloude_recording_stream(token._id, token.agoraAppId, his.end);
    return token;
  }



};
const seller_go_live_details = async (req) => {

};
const start_cloud = async (req) => {

};


const geenerate_rtc_token = async (chennel, uid, role, expirationTimestamp, agoraID) => {
  let agoraToken = await AgoraAppId.findById(agoraID);
  console.log(chennel, uid, role, expirationTimestamp, agoraID, agoraToken);
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



module.exports = {
  getDatas,
  get_stream_details,
  send_otp,
  verify_otp,
  select_data_time,
  add_one_more_time,
  seller_go_live,
  seller_go_live_details,
  start_cloud
};
