const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const supplierSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  type:{
      type:String,
  },
  tradeName: {
    type: String,
  },
  secretName:{
    type:String,
  },
  companytype: {
    type: String,
    // enum: ['Proprietorship', 'LLP', 'Partnership', 'Private Limited', 'Public Limited', 'Others'],
  },
  primaryContactNumber: {
    type: String,
    unique: [true, 'mobileNumber already taken'],
  },
  primaryContactName: {
    type: String,
  },
  secondaryContactName: {
    type: String,
  },
  secondaryContactNumber: {
    type: String,
  },
  RegisteredAddress: {
    type: String,
  },
  countries: {
    type: String,
  },
  state: {
    type: String,
  },
  district: {
    type: String,
  },
  gpsLocat: {
    type: String,
  },
  gstNo: {
    type: String,
  },
  email: {
    type: String,
    required:true,
    unique: [true, 'email already taken'],
    trim: true,
    lowercase: true,
  },
  dateOfBirth: {
    type: String,
  },
  password:{
    type:String,
  },
  createdBy:{
    type:String,
  },
  pinCode: {
    type: Number,
  },
  productDealingWith: {
    type: String,
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

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;