const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { v4}=require('uuid')
const { toJSON, paginate } = require('./plugins');

const jobEnquirySchema = mongoose.Schema({
  _id :{
    type : String,
    default:v4
  },
  name: {
    type: String,
    
  },
  email: {
    type: String,
  },
  mobileno: {
    type: Number,
  },
  Enquiry: {
    type: String,
  },
});
jobEnquirySchema.plugin(toJSON);
jobEnquirySchema.plugin(paginate);
const jobEnquiry = mongoose.model('jobEnquiry', jobEnquirySchema);
module.exports = jobEnquiry;
