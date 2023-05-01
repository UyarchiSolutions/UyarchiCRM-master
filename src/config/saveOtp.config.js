const { CreateSupplierOtp } = require('../models/supplier.OTP.model');
const { SubHostOTP } = require('../models/subHost.Otp.model');

const saveOtp = async (number, otp, supplier) => {
  return await CreateSupplierOtp.create({
    OTP: otp,
    mobileNumber: number,
    supplierId: supplier._id,
  });
};

const saveSubHostOTP = async (number, otp) => {
  return await SubHostOTP.create({
    OTP: otp,
    phoneNumber: number,
  });
};

module.exports = { saveOtp, saveSubHostOTP };
