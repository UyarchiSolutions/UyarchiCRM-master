const OTP = require('../models/RealEstate.Otp.model');
const moment = require('moment');
const saveOtp = async (number, otp) => {
  return await OTP.create({
    otp: otp,
    number: number,
    created: moment(),
  });
};

module.exports = { saveOtp };
