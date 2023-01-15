const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const jobEnquiryservice= require('../services/jobEnquiry.service');
 
const createjobEnquiry= catchAsync(async (req, res) => {
    const jobEnquiry = await jobEnquiryservice.createjobEnquiry(req.body);
    res.send(jobEnquiry);
  });
  
  const getjobEnquiry = catchAsync(async (req, res) => {
    const jobEnquiry = await jobEnquiryservice.getjobEnquiry();
    res.send(jobEnquiry);
  });

  module.exports={createjobEnquiry,getjobEnquiry};
