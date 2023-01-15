const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const {jobApplication} = require('../models');
const createjobApplication = async (userBody) => {
  // if (await jobApplication.isEmailTaken(userBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  return jobApplication.create(userBody);
};
  
  const getjobApplication = async () => {
    const jobApplication=await jobApplicatiomodel.find();
    return jobApplication;
  };
  
  module.exports = { createjobApplication, getjobApplication };
  