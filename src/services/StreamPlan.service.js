const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { StreamPlan, PurchasePlan } = require('../models/StreamPlan.model');
const moment = require('moment');
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

const getActive_Planes = async () => {
  let values = await StreamPlan.find({ active: true, userType: 'Seller' });
  return values;
};

// Purchase Plan Flow

const Purchase_plan = async (body, userId) => {
  const { planId } = body;
  const Plan = await StreamPlan.findById(planId);
  let streamValid;
  let streamingValid;
  Plan.Stream_validity;
  Plan.validity_of_plan ? (streamValid = moment().add(Plan.validity_of_plan, 'days').toDate()) : '';
  Plan.Stream_validity ? (streamingValid = moment().add(Plan.Stream_validity, 'days').toDate()) : '';
  let values = {
    planId: planId,
    userType: Plan.userType,
    planType: Plan.planType,
    planMode: Plan.planMode,
    no_of_Stream: Plan.no_of_Stream,
    no_of_host_per_Stream: Plan.no_of_host_per_Stream,
    Duration_per_stream: Plan.Duration_per_stream,
    Entry_Permit_to_participants: Plan.Entry_Permit_to_participants,
    No_buyer_contact_Reveals: Plan.No_buyer_contact_Reveals,
    No_of_participants_Limit: Plan.No_of_participants_Limit,
    validity_of_plan: Plan.validity_of_plan,
    validity_of_plan_Iso: streamValid,
    Stream_validity: Plan.Stream_validity,
    Stream_validity_Iso: streamingValid,
    Regular_Price: Plan.Regular_Price,
    Offer_Price: Plan.Offer_Price,
    Chat_Needed: Plan.Chat_Needed,
    post_Stream: Plan.post_Stream,
    service_Charges: Plan.service_Charges,
    Description: Plan.Description,
    availableStream: parseInt(Plan.no_of_Stream),
    userId: userId,
  };
  let data = await PurchasePlan.create(values);
  return data;
};

const getPurchased_Planes = async (userId) => {
  let current = moment().toDate();
  let values = await PurchasePlan.aggregate([
    {
      $match: {
        userId: userId,
      },
    },
    {
      $addFields: { status: { $gt: [current, '$validity_of_plan_Iso'] } },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        userType: 1,
        planType: 1,
        planMode: 1,
        no_of_Stream: 1,
        no_of_host_per_Stream: 1,
        Duration_per_stream: 1,
        Entry_Permit_to_participants: 1,
        No_buyer_contact_Reveals: 1,
        No_of_participants_Limit: 1,
        validity_of_plan: 1,
        validity_of_plan_Iso: 1,
        Stream_validity: 1,
        Stream_validity_Iso: 1,
        Regular_Price: 1,
        Offer_Price: 1,
        Chat_Needed: 1,
        post_Stream: 1,
        service_Charges: 1,
        Description: 1,
        availableStream: 1,
        userId: 1,
        createdAt: 1,
      },
    },
  ]);
  return values;
};

module.exports = {
  Creact_Stream_Plan,
  get_Stream_Plan_ById,
  Active_Inactive,
  update_StreamPlan,
  fetch_Stream_Planes,
  getActive_Planes,
  Purchase_plan,
  getPurchased_Planes,
};
