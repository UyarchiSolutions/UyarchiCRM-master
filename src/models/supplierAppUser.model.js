const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const validator = require('validator');
const supplierAppUserSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  tradeName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  secretName:{
    type:String,
  },
  dateOfBirth: {
    type: String,
  },
  companyType: {
    type: String,
  },
  primaryContactName : {
    type: String,
  },
  primaryContactNumber:{
    type:Number,
  },
  secondaryContactName:{
      type:String,
  },
  secondaryConatactNumber:{
    type:Number,
  },
  gstNo:{
    type:String,
  },
  RegisteredAddress:{
    type:String,
  },
  country:{
    type:String,
  },
  state:{
    type:String,
  },
  district:{
    type:String,
  },
  pincode:{
    type:Number,
  },
  location:{
    type:String,
  },
  productDealing:{
    type:String,
  },
  status:{
    type:String,
  },
  reason:{
    type:String,
  },
  type:{
    type:String,
  },
  createdBy:{
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
 
  });
// manageUserSchema.plugin(toJSON);
// manageUserSchema.plugin(paginate);
const supplierAppUser = mongoose.model('supplierAppUser', supplierAppUserSchema);

module.exports = supplierAppUser;