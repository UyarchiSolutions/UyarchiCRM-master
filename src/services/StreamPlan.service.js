const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const StreamPlan = require('../models/StreamPlan.model');

// create Stream Plan

const Creact_Stream_Plan = async (body) => {
  let values = await StreamPlan.create(body);
  return values;
};

// get Stream Plan by Id

const get_Stream_Plan_ById = async (id) => {
  let values = await StreamPlan.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Stream Not Available');
  }
  return values;
};

const Active_Inactive = async (id, body) => {
  let values = await StreamPlan.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Stream Plan Not Availbale');
  }
  const { type } = body;
  if (type == 'active') {
    values = await StreamPlan.findByIdAndUpdate({ _id: id }, { active: true }, { new: true });
  } else {
    values = await StreamPlan.findByIdAndUpdate({ _id: id }, { active: false }, { new: true });
  }
  return values;
};

const update_StreamPlan = async (id, body) => {
  let values = await StreamPlan.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Stream Plan Not Available');
  }
  return values;
};

const fetch_Stream_Planes = async (page, range) => {
  range = parseInt(range);
  page = parseInt(page);
  let values = await StreamPlan.aggregate([
    {
      $skip: range * page,
    },
    {
      $limit: range,
    },
  ]);
  let total = await StreamPlan.find().count();
  return { values: values, total: total };
};

module.exports = {
  Creact_Stream_Plan,
  get_Stream_Plan_ById,
  Active_Inactive,
  update_StreamPlan,
  fetch_Stream_Planes,
};
