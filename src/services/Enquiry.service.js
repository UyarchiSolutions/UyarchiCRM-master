const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { Enquiery, Heading, FAQ } = require('../models/Enquiry.model');

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

const sendReplayEnquiry = async (body) => {
  let data = await Enquiery.findById(body._id);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Enquery Not Bad');
  }
  data = await Enquiery.findByIdAndUpdate({ _id: body._id }, { status: 'Replied', answer: body.Answer }, { new: true });
};

const getEnquiry = async (query) => {
  const { range, page } = query;
  console.log(parseInt(range) * (parseInt(page) + 1));
  const data = await Enquiery.aggregate([
    {
      $sort: { createdAt: -1 },
    },
    { $skip: parseInt(range) * parseInt(page) },
    {
      $limit: parseInt(range),
    },
  ]);

  const total = await Enquiery.aggregate([
    {
      $limit: parseInt(range),
    },
    { $skip: parseInt(range) * (parseInt(page) + 1) },
  ]);

  let next;
  if (total.length != 0) {
    next = true;
  } else {
    next = false;
  }
  return { values: data, next: next };
};

const remove = async (id) => {
  let data = await Enquiery.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Enquery not Available');
  }
  data = await Enquiery.findByIdAndUpdate({ _id: id }, { status: 'Rejected' }, { new: true });
  return data;
};

const createFAQ = async (body) => {
  const { heading } = body;
  let existHeading = await Heading.findById(heading);
};

module.exports = {
  createEnquiry,
  getEnquiry,
  sendReplayEnquiry,
  remove,
};
