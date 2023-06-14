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
  let headId;
  if (!existHeading) {
    let creation = await Heading.create({ heading: heading });
    headId = creation._id;
  } else {
    headId = existHeading._id;
  }
  let data = await FAQ.create({ ...body, ...{ headingId: headId } });
  return data;
};

const updateFaq = async (id, body) => {
  let values = await FAQ.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'FAQ Not Available');
  }
  values = await FAQ.findByIdAndUpdate({ _id: id }, body, { new: true });
  return values;
};

const getFaq = async () => {
  const data = await FAQ.aggregate([
    {
      $match: { active: true },
    },
    {
      $lookup: {
        from: 'headings',
        localField: 'headingId',
        foreignField: '_id',
        as: 'heading',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$heading',
      },
    },
  ]);
  return data;
};

const getHeadingOnly = async () => {
  const data = await Heading.find({ active: true });
  return data;
};

module.exports = {
  createEnquiry,
  getEnquiry,
  sendReplayEnquiry,
  remove,
  createFAQ,
  updateFaq,
  getFaq,
  getHeadingOnly,
};
