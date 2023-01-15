const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const jobEnquirymodel = require('../models/jobEnquiry.model');

const createjobEnquiry = async (body) => {
  const jobEnquiry = await jobEnquirymodel.create(body);
  return jobEnquiry;
};

const getjobEnquiry = async () => {
  const jobEnquiry= await jobEnquirymodel.find();
  return jobEnquiry;
};

module.exports = { createjobEnquiry , getjobEnquiry };


