const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { Enquiery, Heading, FAQ, Report } = require('../models/Enquiry.model');
const { SellerPost } = require('../models/BuyerSeller.model');
const { SellerNotification } = require('../models/BuyerPropertyRelation.model');

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
  let headingId;
  let heading = await Heading.findById(body.heading);
  if (!heading) {
    let head = await Heading.create({ heading: body.heading });
    headingId = head._id;
  } else {
    headingId = heading._id;
  }
  let data = { ...body, ...{ headingId: headingId } };
  values = await FAQ.findByIdAndUpdate({ _id: id }, data, { new: true });
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

const getFAQByHeadingId = async () => {
  const data = await FAQ.aggregate([
    {
      $match: {
        active: true,
      },
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
    {
      $group: {
        _id: '$heading',
        val: { $push: { Answer: '$Answer', Question: '$Question' } },
      },
    },
    {
      $project: {
        _id: '$_id._id',
        heading: '$_id.heading',
        FAQ: '$val',
      },
    },
  ]);
  return data;
};

const getHeadingOnly = async () => {
  const data = await Heading.find({ active: true });
  return data;
};

const RemoveFAQ = async (id) => {
  let faq = await FAQ.findById(id);
  if (!faq) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'FAQ Not Available');
  }
  faq = await FAQ.findByIdAndUpdate({ _id: id }, { active: false }, { new: true });
  return faq;
};

// Report
const createReport = async (body, userId) => {
  let findProp = await SellerPost.findById(body.propertyId);
  if (!findProp) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Property not found');
  }
  let creation = await Report.create({ ...body, ...{ userId: userId } });
  // await SellerNotification.create({
  //   type: 'Report',
  //   buyerId: userId,
  //   sellerId: findProp.userId,
  //   postId: findProp._id,
  //   reportId: creation,
  //   reportDate_Time: moment(),
  // });
  return creation;
};

const getAllReport = async () => {
  let allReports = await SellerPost.aggregate([
    {
      $lookup: {
        from: 'reports',
        localField: '_id',
        foreignField: 'propertyId',
        pipeline: [
          {
            $lookup: {
              from: 'buyers',
              localField: 'userId',
              foreignField: '_id',
              as: 'buyer',
            },
          },
          {
            $unwind: '$buyer',
          },
        ],
        as: 'propReport',
      },
    },
    { $addFields: { report: { $size: '$propReport' } } },
    { $match: { report: { $gt: 0 } } },
    // {
    //   $lookup: {
    //     from: 'buyers',
    //     localField: 'userId',
    //     foreignField: '_id',
    //     as: 'seller',
    //   },
    // },
    // {
    //   $unwind: '$seller',
    // },
  ]);
  return allReports;
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
  RemoveFAQ,
  createReport,
  getAllReport,
  getFAQByHeadingId,
};
