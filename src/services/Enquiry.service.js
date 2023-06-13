const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { Enquiery } = require('../models/Enquiry.model');

const createEnquiry = async (body) => {
  const date = moment().format('DD-MM-YYYY');
  let values = { ...body, ...{ date: date } };
  const creation = await Enquiery.create(values);
  return creation;
};

const getEnquiry = async (query) => {
  const { range, page } = query;
  const data = await Enquiery.aggregate([
    {
      $sort: { createdAt: -1 },
    },
    { $skip: parseInt(range) * parseInt(page) },
    {
      $limit: parseInt(range),
    },
  ]);

  const total = await Enquiery([
    { $skip: parseInt(range) * (parseInt(page) + 1) },
    {
      $limit: parseInt(range),
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
