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




module.exports = {
  getDatas,
  get_stream_details,
  send_otp
};
