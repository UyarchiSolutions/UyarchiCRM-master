const { CreateSupplierOtp } = require('../models/supplier.OTP.model');

const saveOtp = async (number, otp, supplier) => {
  return await CreateSupplierOtp.create({
    OTP: otp,
    mobileNumber: number,
    supplierId: supplier._id,
  });
};

module.exports = { saveOtp };
