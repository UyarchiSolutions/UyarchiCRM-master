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
  const token = await DemoPost.findById(id);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  if (token.otp_verifiyed != verify) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Access');
  }

  let start = new Date(date).getTime();
  let end = new Date(moment(date).add(30, 'minutes')).getTime();

  let history = new MutibleDemo.create({
    streamId: token._id,
    start: start,
    end: end,
    actualEnd: end
  })

  return history;
};

const add_one_more_time = async (req) => {
  let { post } = req.body;
  const token = await DemoPost.findById(post);
  if (!token) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Link');
  }
  if (token.status != 'Completed') {
    throw new ApiError(httpStatus.NOT_FOUND, 'Previous Stream Not Completed');
  }
  token.status = 'Pending';
  token.runningStream = history._id;
  token.save();

  return token;
};



module.exports = {
  getDatas,
  get_stream_details,
  send_otp,
  verify_otp,
  select_data_time,
  add_one_more_time
};
