const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const usersPlan = require('../models/usersPlane.model');
const AdminPlan = require('../models/AdminPlan.model');
const moment = require('moment');

const createUserPlan = async (body, id) => {
  let today = moment().toDate();
  const { PlanRole } = body;
  let values;
  const plan = await AdminPlan.findById(body.PlanId);
  if (!plan) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'plan Not Found');
  }
  if (PlanRole === 'Buyer') {
    let planvalid = moment().add(plan.PlanValidate, 'days');
    values = { ...body, ...{ created: moment(), userId: id, planValidate: planvalid } };
  }
  if (PlanRole === 'Seller') {
    let planvalid = moment().add(plan.PlanValidate, 'days');
    let postvalid = moment().add(plan.postValidate, 'days');
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
