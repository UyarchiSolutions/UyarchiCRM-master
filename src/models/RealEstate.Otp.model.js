const mongoose = require('mongoose');
const { v4 } = require('uuid');

const OTPSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  number: {
    type: Number,
  },
  otp: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
  },
});

const OTP = new mongoose.model('realEstateOtp', OTPSchema);

module.exports = OTP;
