const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const EnquieryService = require('../services/Enquiry.service');

const createEnquiry = catchAsync(async (req, res) => {
  const data = await EnquieryService.createEnquiry(req.body);
  res.send(data);
});

const getEnquiry = catchAsync(async (req, res) => {
  const data = await EnquieryService.getEnquiry(req.query);
  res.send(data);
});

module.exports = {
  createEnquiry,
  getEnquiry,
};
