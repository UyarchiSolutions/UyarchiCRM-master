const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { AgoraAppId, UsageAppID, TestAgora } = require('../models/AgoraAppId.model');
const Agora = require('agora-access-token');
const axios = require('axios');

const InsertAppId = async (req) => {

  let body = req.body;
  let userId = req.userId;

  let authorization = req.body.cloud_KEY + ":" + req.body.cloud_secret
  body = { ...body, ...{ Authorization: authorization, userId: userId } }
  let appId = await AgoraAppId.create(body);

  return appId;

}
const InsertAget_app_id = async (req) => {
  let id = req.query.id;
  let appId = await AgoraAppId.findById(id)
  // return await token_assign(400, 65778,"demo");
  return appId;

}
const get_all_token = async (req) => {
  let page = req.query.page == '' || req.query.page == null || req.query.page == null ? 0 : parseInt(req.query.page);

  statuFilter = { active: true }
  if (req.query.status != null && req.query.status != '' && req.query.status != undefined) {
    if (req.query.status != 'all') {
      statuFilter = { verifyStatus: { $eq: req.query.status } }
    }
  }
  let appId = await AgoraAppId.aggregate([
    { $match: { $and: [statuFilter] } },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'verifiedBy',
        foreignField: '_id',
        as: 'b2busers',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$b2busers',
      },
    },
    {
      $addFields: {
        verifiedBy: { $ifNull: ['$b2busers.name', null] },
      },
    },
    {
      $skip: 20 * parseInt(page),
    },
    {
      $limit: 20,
    },
  ])
  let next = await AgoraAppId.aggregate([
    { $match: { $and: [statuFilter] } },
    {
      $skip: 20 * (parseInt(page) + 1),
    },
    {
      $limit: 20,
    },
  ])

  return { value: appId, next: next.length != 0 };

}

const get_all_token_my = async (req) => {
  let page = req.query.page == '' || req.query.page == null || req.query.page == null ? 0 : parseInt(req.query.page);
  let appId = await AgoraAppId.aggregate([
    { $match: { $and: [{ userId: { $eq: req.userId } }] } },
    {
      $skip: 20 * parseInt(page),
    },
    {
      $limit: 20,
    },
  ])
  let next = await AgoraAppId.aggregate([
    { $match: { $and: [{ userId: { $eq: req.userId } }] } },
    {
      $skip: 20 * (parseInt(page) + 1),
    },
    {
      $limit: 20,
    },
  ])

  return { value: appId, next: next.length != 0 };

}


const get_all_token_check = async (req) => {
  let page = req.query.page == '' || req.query.page == null || req.query.page == null ? 0 : parseInt(req.query.page);
  // await AgoraAppId.updateMany({ cloud_KEY: { $ne: null } }, { $set: { verifyStatus: "Pending", active: true } }, { new: true })
  let appId = await AgoraAppId.aggregate([
    { $match: { $and: [{ verifyStatus: { $in: [null, 'pending'] } }] } },
    {
      $skip: 20 * parseInt(page),
    },
    {
      $limit: 20,
    },
  ])
  let next = await AgoraAppId.aggregate([
    { $match: { $and: [{ verifyStatus: { $in: [null, 'pending'] } }] } },
    {
      $skip: 20 * (parseInt(page) + 1),
    },
    {
      $limit: 20,
    },
  ])

  return { value: appId, next: next.length != 0 };

}
const { Country, State, City } = require('country-state-city');

const get_country_list = async (req) => {
  // const csc = require('country-state-city').Country;
  const countries = Country.getAllCountries();
  // console.log(countries);
  return countries;

}

const get_state_list = async (req) => {

  // const csc = require('country-state-city').Country;
  const state = State.getStatesOfCountry(req.query.county);
  // console.log(state);
  return state;


}
const get_city_list = async (req) => {
  const cities = City.getCitiesOfState(req.query.county, req.query.state);
  return cities;


}

const token_assign = async (minutes, streamID, streamType) => {
  let minimum = 9500 - parseInt(minutes);
  let token = await AgoraAppId.find({ expired: false, userMinutes: { $lt: minimum }, type: { $ne: "paid" } }).limit(10);
  let paid = await AgoraAppId.findById('33ee26ed-c087-4e5f-b11d-dc0972e2bd36');
  console.log(paid)
  console.log(token)
  return new Promise(async (resolve) => {
    if (minutes < 9500) {
      for (let i = 0; i < token.length; i++) {
        // console.log(element)
        let element = token[i];
        let usedMinutes = element.userMinutes ? element.userMinutes : 0;
        if (usedMinutes + minutes <= 9500) {
          let vals = await UsageAppID.create({
            dateISO: moment(),
            date: moment().format('YYYY-MM-DD'),
            streamID: streamID,
            appID: element._id,
            minutes: minutes,
            streamType: streamType
          })
          element.userMinutes = usedMinutes + minutes;
          element.save();
          resolve({ vals, element });
          if (9450 < element.userMinutes) {
            element.expired = true;
          }
          break;
        }
        else {
          if (9400 < usedMinutes) {
            element.expired = true;
          }
        }
        element.save();
      }
    }
    else {
      let usedMinutes = paid.userMinutes ? paid.userMinutes : 0;
      let vals = await UsageAppID.create({
        dateISO: moment(),
        date: moment().format('YYYY-MM-DD'),
        streamID: streamID,
        appID: paid._id,
        minutes: minutes,
        streamType: streamType
      })
      paid.userMinutes = usedMinutes + minutes;
      paid.save();
      resolve({ vals, element: paid });
    }
  });

}

const get_token_usage_agri = async (req) => {
  let page = req.query.page == '' || req.query.page == null || req.query.page == null ? 0 : parseInt(req.query.page);
  let appId = req.query.id;
  let value = await UsageAppID.aggregate([
    { $match: { $and: [{ appID: { $eq: appId } }, { streamType: { $eq: "agri" } }] } },
    {
      $lookup: {
        from: 'streamrequests',
        localField: 'streamID',
        foreignField: '_id',
        as: 'streamrequests',
      },
    },
    {
      $unwind: '$streamrequests',
    },
    {
      $project: {
        _id: 1,
        dateISO: 1,
        streamID: 1,
        date: 1,
        minutes: 1,
        streamType: 1,
        streamName: "$streamrequests.streamName",
        startTime: "$streamrequests.startTime"
      }
    },
    {
      $skip: 10 * parseInt(page),
    },
    {
      $limit: 10,
    },

  ])
  let next = await UsageAppID.aggregate([
    { $match: { $and: [{ appID: { $eq: appId } }, { streamType: { $eq: "agri" } }] } },
    {
      $lookup: {
        from: 'streamrequests',
        localField: 'streamID',
        foreignField: '_id',
        as: 'streamrequests',
      },
    },
    {
      $unwind: '$streamrequests',
    },
    {
      $skip: 10 * (parseInt(page) + 1),
    },
    {
      $limit: 10,
    },
  ])

  return { value: value, next: next.length != 0 };
}
const get_token_usage_demo = async (req) => {
  let page = req.query.page == '' || req.query.page == null || req.query.page == null ? 0 : parseInt(req.query.page);
  let appId = req.query.id;
  let value = await UsageAppID.aggregate([
    { $match: { $and: [{ appID: { $eq: appId } }, { streamType: { $eq: "demo" } }] } },

  ])
}
const generateUid = async (req) => {
  const length = 5;
  const randomNo = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
  return randomNo;
};


const test_appid = async (req) => {
  let id = req.query.id;
  let appId = await AgoraAppId.findById(id)
  const uid = await generateUid();
  const role = req.body.isPublisher ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;
  const currentTimestamp = moment().add(35, 'seconds');
  const expirationTimestamp = currentTimestamp / 1000
  const token = await geenerate_rtc_token(id, uid, role, expirationTimestamp, appId._id);
  let test = await TestAgora.create(
    {
      testToken: token,
      testUD: uid,
      endTime: currentTimestamp,
      test_by: req.userId,
      tokenId: id
    }
  )
  await start_cloud_record(expirationTimestamp, id, appId, test._id)

  return test;
}
const geenerate_rtc_token = async (chennel, uid, role, expirationTimestamp, agoraID) => {
  let agoraToken = await AgoraAppId.findById(agoraID)
  return Agora.RtcTokenBuilder.buildTokenWithUid(agoraToken.appID.replace(/\s/g, ''), agoraToken.appCertificate.replace(/\s/g, ''), chennel, uid, role, expirationTimestamp);
};


const start_cloud_record = async (expirationTimestamp, chennel, appId, testId) => {
  const uid = await generateUid();
  const role = Agora.RtcRole.SUBSCRIBER;
  const token = await geenerate_rtc_token(chennel, uid, role, expirationTimestamp, appId._id);

  let test = await TestAgora.findByIdAndUpdate({ _id: testId }, { cloud_testToken: token, cloud_testUD: uid, store: testId.replace(/[^a-zA-Z0-9]/g, '',), status: "created" })

  await agora_acquire(test._id, test.tokenId)
}

const agora_acquire = async (id, agroaID) => {
  let temtoken = id;
  let agoraToken = await AgoraAppId.findById(agroaID);
  let test = await TestAgora.findById(id);
  const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString('base64')}`;
  await axios.post(
    `https://api.agora.io/v1/apps/${agoraToken.appID.replace(/\s/g, '')}/cloud_recording/acquire`,
    {
      cname: test.tokenId,
      uid: test.cloud_testUD.toString(),
      clientRequest: {
        resourceExpiredHour: 24,
        scene: 0,
      },
    },
    { headers: { Authorization } }
  ).then((res) => {
    test.resourceId = res.data.resourceId;
    test.status = 'acquire';
    test.save();
  }).catch(async (error) => {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cloud Recording Error: ' + error.message);
  });


};



const recording_start = async (req) => {
  let test = await TestAgora.findById(req.query.id);
  console.log(test)
  if (test) {
    let agoraToken = await AgoraAppId.findById(test.tokenId);
    const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString(
      'base64'
    )}`;
    if (test.status == 'acquire') {
      const resource = test.resourceId;
      //console.log(resource)
      //console.log(token)
      const mode = 'mix';
      console.log(`https://api.agora.io/v1/apps/${agoraToken.appID.replace(/\s/g, '')}/cloud_recording/resourceid/${resource}/mode/${mode}/start`, 9876578)
      const start = await axios.post(
        `https://api.agora.io/v1/apps/${agoraToken.appID.replace(/\s/g, '')}/cloud_recording/resourceid/${resource}/mode/${mode}/start`,
        {
          cname: test.tokenId,
          uid: test.cloud_testUD.toString(),
          clientRequest: {
            token: test.cloud_testToken,
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
              fileNamePrefix: ['test', test.store, test.cloud_testUD.toString()],
            },
          },
        },
        { headers: { Authorization } }
      )
        .then((res) => {
          test.resourceId = res.data.resourceId;
          test.sid = res.data.sid;
          test.status = 'start';
          test.save();
          setTimeout(async () => {
            await recording_query(test._id);
          }, 3000);

          return { message: "started" }
        }).catch((err) => {
          throw new ApiError(httpStatus.NOT_FOUND, 'Cloud Recording Start: ' + err.message);
        })


      return start;
    }
    else {
      return { message: 'Already Started' };
    }
  }
  else {
    return { message: 'Already Started' };
  }
};
const recording_query = async (id) => {
  let test = await TestAgora.findById(id);
  let agoraToken = await AgoraAppId.findById(test.tokenId);
  const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString('base64')}`;
  const resource = test.resourceId;
  const sid = test.sid;
  const mode = 'mix';
  let query = await axios.get(
    `https://api.agora.io/v1/apps/${agoraToken.appID.replace(/\s/g, '')}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/query`,
    { headers: { Authorization } }
  ).then((res) => {
    if (res.data.serverResponse.fileList.length > 0) {
      test.recordLink = res.data.serverResponse.fileList[0].fileName;
      test.recordLinks = res.data.serverResponse.fileList;
      let m3u8 = res.data.serverResponse.fileList[0].fileName;
      if (m3u8 != null) {
        let mp4 = m3u8.replace('.m3u8', '_0.mp4')
        test.recordLink_mp4 = "https://streamingupload.s3.ap-south-1.amazonaws.com/" + mp4;
      }
      test.status = 'query';
      test.save();
    }

    return res.data;
  }).catch((err) => {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cloud Recording Query: ' + err.message);
  });

  return query;
};


const recording_stop = async (req) => {
  const mode = 'mix';
  let test = await TestAgora.findById(req.query.id);
  let agoraToken = await AgoraAppId.findById(test.tokenId);
  test.status = "stop";
  test.save();
  const Authorization = `Basic ${Buffer.from(agoraToken.Authorization.replace(/\s/g, '')).toString('base64')}`;
  const resource = test.resourceId;
  const sid = test.sid;
  const stop = await axios.post(
    `https://api.agora.io/v1/apps/${agoraToken.appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/stop`,
    {
      cname: test.tokenId,
      uid: test.cloud_testUD.toString(),
      clientRequest: {},
    },
    {
      headers: {
        Authorization,
      },
    }
  ).then((res) => {
    return res.data;
  }).catch((err) => {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cloud Recording Stop:' + err.message);
  });

  return stop
};


const get_test_details_test = async (req) => {
  let test = await TestAgora.findById(req.query.id);
  let agoraToken = await AgoraAppId.findById(test.tokenId);


  return { test, agoraToken }
}

const update_check_appid = async (req, data) => {
  let test = await TestAgora.findById(req.query.id);
  if (!test) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Testing not found');
  }
  let agoraToken = await AgoraAppId.findById(test.tokenId);
  if (!agoraToken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Agora App id not found');

  }
  agoraToken.verifyStatus = data;
  agoraToken.verifiedBy = req.userId;
  agoraToken.verifiedTime = moment()

  agoraToken.save();
  return agoraToken;
}



module.exports = {
  InsertAppId,
  InsertAget_app_id,
  get_all_token,
  get_state_list,
  get_country_list,
  get_city_list,
  token_assign,
  get_token_usage_agri,
  get_token_usage_demo,
  test_appid,
  recording_stop,
  recording_start,
  get_test_details_test,
  get_all_token_check,
  update_check_appid,
  get_all_token_my
};
