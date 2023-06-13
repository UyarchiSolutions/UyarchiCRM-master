const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const jobEnquirymodel = require('../models/jobEnquiry.model');

const createjobEnquiry = async (body) => {
  let findOrders = await jobEnquirymodel.find().count();
  let center = '';
  if (findOrders < 9) {
    center = '0000';
  }
  if (findOrders < 99 && findOrders >= 9) {
    center = '000';
  }
  if (findOrders < 999 && findOrders >= 99) {
    center = '00';
  }
  if (findOrders < 9999 && findOrders >= 999) {
    center = '0';
  }
  let count = findOrders + 1;
  let orderId = `ENQ${center}${count}`;

  const jobEnquiry = await jobEnquirymodel.create(...body, { EnquiryId: orderId });
  return jobEnquiry;
};

const getjobEnquiry = async () => {
  const jobEnquiry = await jobEnquirymodel.find({ active: true });
  return jobEnquiry;
};

module.exports = { createjobEnquiry, getjobEnquiry };
