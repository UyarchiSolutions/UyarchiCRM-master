const mongoose = require('mongoose');
const { v4 } = require('uuid');

const SubHostOTPSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    OTP: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
    phoneNumber: {
      type: Number,
    },
  },
  { timestamps: true }
);

const SubHostOTP = mongoose.model('subhostOTP', SubHostOTPSchema);

module.exports = {
  SubHostOTP,
};
