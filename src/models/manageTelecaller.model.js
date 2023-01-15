const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const manageTelecallerSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  name: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  gender: {
    type: String,
    enum:["Male","Female"],
  },
  email: {
    type: String,
    required: [true, 'email already taken'],
    unique: true,
    trim: true,
    lowercase: true,
    // validate(value) {
    //   if (!validator.isEmail(value)) {
    //     throw new Error('Invalid email');
    //   }
    // },
  },
  mobileNumber:{
    type:Number,
    unique: true,
  },
  role:{
    type:String,
  },
  mobileNumber1:{
      type:Number,
  },
  address:{
    type:String,
  },
  pincode:{
    type:Number,
  },
  idProofNo:{
    type:String,
  },
  // idProofUpload:{
  //   type:String,
  // },
  country:{
    type:String,
  },
  state:{
    type:String,
  },
  city:{
    type:String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  }
);
const ManageTelecaller = mongoose.model('manageTelecaller', manageTelecallerSchema);

module.exports = ManageTelecaller;