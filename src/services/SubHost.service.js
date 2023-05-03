const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const SubHost = require('../models/SubHost.model');
const { SubHostOTP } = require('../models/subHost.Otp.model');
const { Otp } = require('../config/subHostOTP');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const RequestStream = require('../models/requestStream.model');

// create SubHost

const create_SubHost = async (body, userId) => {
  let datas = { ...body, ...{ createdBy: userId } };
  let values = await SubHost.create(datas);
  return values;
};

const get_created_Subhost_By_Seller = async (id) => {
  let values = await SubHost.aggregate([
    {
      $match: {
        createdBy: id,
      },
    },
  ]);
  return values;
};

const Active_Inactive_SubHost = async (id, body) => {
  const { type } = body;
  let host = await SubHost.findById(id);
  if (!host) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Sub Host Not Available');
  }
  if (type == 'active') {
    host = await SubHost.findByIdAndUpdate({ _id: id }, { active: true }, { new: true });
  } else {
    host = await SubHost.findByIdAndUpdate({ _id: id }, { active: false }, { new: true });
  }
  return host;
};

const updateSubHost = async (id, body) => {
  let host = await SubHost.findById(id);
  if (!host) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Sub Host not Available');
  }
  host = await SubHost.findByIdAndUpdate({ _id: id }, body, { new: true });
  return host;
};

const getSubHostById = async (id) => {
  const data = await SubHost.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Sub Host Not Available');
  }
  return data;
};

const sendOtpTOSubHost = async (body) => {
  let subhost = await SubHost.findOne({ phoneNumber: body.mobileNumber }).sort({ createdAt: -1 });
  if (!subhost) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'subHost Not Available');
  }
  return Otp(body);
};

const verifyOtpforSubhost = async (body) => {
  const { otp } = body;
  let values = await SubHostOTP.findOne({ OTP: otp, active: true });
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Otp Not Found OR Used');
  }
  await SubHostOTP.findByIdAndUpdate({ _id: values._id }, { active: false }, { new: true });
  let user = await SubHost.findOne({ phoneNumber: values.phoneNumber });
  return { message: 'Verfication Scceeded', user: user };
};

const setPassword = async (id, body) => {
  let { password } = body;
  password = await bcrypt.hash(password, 8);
  let setPassword = await SubHost.findByIdAndUpdate({ _id: id }, { password: password }, { new: true });
  return setPassword;
};

const Login = async (body) => {
  const { email, password } = body;
  const user = await SubHost.findOne({ email: email, active: true });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const getSubHostForChat = async (userId) => {
  let values = await SubHost.aggregate([
    {
      $match: {
        createdBy: userId,
        role: { $in: ['Chat/Stream', 'Chat'] },
      },
    },
  ]);
  return values;
};

const getSubHostForStream = async (userId) => {
  let values = await SubHost.aggregate([
    {
      $match: {
        createdBy: userId,
        role: { $in: ['Stream', 'Chat/Stream'] },
      },
    },
  ]);
  return values;
};

const getSubHostBy_Login = async (id) => {
  const data = await SubHost.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'SubHost Not Available');
  }
  return data;
};

const getStream_By_SubHost = async (id) => {
  const data = await RequestStream.aggregate([
    {
      $match: {
        $or: [
          {
            allot_host_1: id,
          },
          {
            allot_host_2: id,
          },
          {
            allot_host_3: id,
          },
        ],
      },
    },
  ]);
  return data;
};

module.exports = {
  create_SubHost,
  get_created_Subhost_By_Seller,
  Active_Inactive_SubHost,
  updateSubHost,
  getSubHostById,
  sendOtpTOSubHost,
  verifyOtpforSubhost,
  setPassword,
  Login,
  getSubHostForChat,
  getSubHostForStream,
  getSubHostBy_Login,
  getStream_By_SubHost,
};
