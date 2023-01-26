const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const usersPlan = require('../models/usersPlane.model');
const AdminPlan = require('../models/AdminPlan.model');
const { Buyer } = require('../models/BuyerSeller.model');
const moment = require('moment');

const createUserPlan = async (body, id) => {
  const { PlanRole, PlanId } = body;
  let values;
  if (PlanRole === 'Buyer') {
    let user = await Buyer.findById(id);
    let viewPlan = user.contactView;
    if (viewPlan > 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Please Use Default Plan ');
    }
  }
  if (PlanRole === 'Seller') {
    let user = await Buyer.findById(id);
    let postPlan = user.plane;
    if (postPlan > 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Please Use Default Plan');
    }
  }
  const plan = await AdminPlan.findById(body.PlanId);
  if (!plan) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'plan Not Found');
  }

  if (PlanRole === 'Buyer') {
    let planvalid = moment().add(plan.PlanValidate, 'days');
    let current = moment().toDate();
    let existPlan = await usersPlan
      .findOne({ userId: id, ContactNumber: { $gt: 0 }, planValidate: { $gt: current } })
      .sort({ created: -1 });
    if (existPlan) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'plan Limit Not Exceeded or Plan Validity Not Expired');
    }
    values = { ...body, ...{ created: moment(), userId: id, planValidate: planvalid } };
  }
  if (PlanRole === 'Seller') {
    let planvalid = moment().add(plan.PlanValidate, 'days');
    let postvalid = moment().add(plan.postValidate, 'days');
    let currentDate = moment().toDate();
    let existPlan = await usersPlan
      .findOne({ userId: id, PostNumber: { $gt: 0 }, planValidate: { $gt: currentDate } })
      .sort({ created: -1 });
    console.log(existPlan);
    if (existPlan) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'plan Limit Not Exceeded or Plan Validity Not Expired');
    }
    values = { ...body, ...{ created: moment(), userId: id, planValidate: planvalid, postValidate: postvalid } };
  }

  let data = await usersPlan.create(values);
  return data;
};

const getLatestUserPlan = async (userId) => {
  const data = await usersPlan.findOne({ userId: userId }).sort({ created: -1 });
  return data;
};

module.exports = { createUserPlan, getLatestUserPlan };
