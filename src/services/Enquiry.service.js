const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { Enquiery } = require('../models/Enquiry.model');

const createEnquiry = async (body) => {
  const creation = await Enquiery.create(body);
  return creation;
};

const getEnquiry = async (query) => {
  const { range, page } = query;
  const data = await Enquiery.aggregate([
    {
      $sort: { createdAt: -1 },
    },
    { $skip: range * page },
    {
      $limit: range,
    },
  ]);

  const total = await Enquiery([
    { $skip: range * (page + 1) },
    {
      $limit: range,
    },
  ]);

  let next;
  if (total.length != 0) {
    next = true;
  } else {
    next = false;
  }
  return { values: data, next: next };
};

module.exports = {
  createEnquiry,
  getEnquiry,
};
