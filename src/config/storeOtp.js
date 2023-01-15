const OTP = require('../models/RealEstate.Otp.model');

const saveOtp = async (number, otp) => {
  return await OTP.create({
    otp: otp,
    number: number,
  });
};

module.exports = { saveOtp };
