const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const createSupplierOtp = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  OTP: {
    type: Number,
  },
  mobileNumber: {
    type: Number,
  },
  supplierId: {
    type: String,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
});

const CreateSupplierOtp = new mongoose.model('SupplierOTP', createSupplierOtp);

module.exports = { CreateSupplierOtp };
