const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const EnquieryService = require('../services/Enquiry.service');
const { sendEmail_Enquiry } = require('../services/email.service');
const createEnquiry = catchAsync(async (req, res) => {
  const data = await EnquieryService.createEnquiry(req.body);
  res.send(data);
});

const getEnquiry = catchAsync(async (req, res) => {
  const data = await EnquieryService.getEnquiry(req.query);
  res.send(data);
});

const sendReplayEnquiry = catchAsync(async (req, res) => {
  const data = await EnquieryService.sendReplayEnquiry(req.body);
  await sendEmail_Enquiry(req.body);
  res.send(data);
});

const remove = catchAsync(async (req, res) => {
  const data = await EnquieryService.remove(req.params.id);
  res.send(data);
});

const createFAQ = catchAsync(async (req, res) => {
  const data = await EnquieryService.createEnquiry(req.body);
  res.send(data);
});

const updateFaq = catchAsync(async (req, res) => {
  const data = await EnquieryService.updateFaq(req.params.id, req.body);
  res.send(data);
});

module.exports = {
  createEnquiry,
  getEnquiry,
  sendReplayEnquiry,
  remove,
  createFAQ,
  updateFaq,
};
