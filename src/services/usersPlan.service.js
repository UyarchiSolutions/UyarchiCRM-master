const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const usersPlan = require('../models/usersPlane.model');
const AdminPlan = require('../models/AdminPlan.model');
const moment = require('moment');

const createUserPlan = async (body, id) => {
  const { PlanRole, PlanId } = body;
  let values;
  const plan = await AdminPlan.findById(body.PlanId);
  if (!plan) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'plan Not Found');
  }

  if (PlanRole === 'Buyer') {
    let planvalid = moment().add(plan.PlanValidate, 'days');
    let existPlan = usersPlan.findOne({}).sort({ created: -1 });
    console.log(existPlan);
    values = { ...body, ...{ created: moment(), userId: id, planValidate: planvalid } };
  }
  if (PlanRole === 'Seller') {
    let planvalid = moment().add(plan.PlanValidate, 'days');
    let postvalid = moment().add(plan.postValidate, 'days');
    let currentDate = moment().toDate();
    let existPlan = await usersPlan
      .findOne({ PlanId: PlanId, userId: id, PostNumber: { $gt: 0 }, planValidate: { $gt: currentDate } })
      .sort({ created: -1 });
    console.log(existPlan);
    if (existPlan) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'plan Limit Not Exceeded or Plan Validity Not Expired');
    }
    values = { ...body, ...{ created: moment(), userId: id, planValidate: planvalid, postValidate: postvalid } };
  }

  // let data = await usersPlan.create(values);
  return plan;
};

const getLatestUserPlan = async (userId) => {
  const data = await usersPlan.findOne({ userId: userId }).sort({ created: -1 });
  return data;
};

module.exports = { createUserPlan, getLatestUserPlan };
