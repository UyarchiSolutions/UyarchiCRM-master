const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { Enquiery } = require('../models/Enquiry.model');

const createEnquiry = async (body) => {
  const date = moment().format('DD-MM-YYYY');
  let findOrders = await Enquiery.find().count();
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
  let values = { ...body, ...{ date: date, EnquiryId: orderId } };
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
