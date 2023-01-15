const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const AdminPlan = require('../models/AdminPlan.model');

const createAdminPlane = async (body) => {
  let tomorrow = moment().add(body.PlanValidate, 'days');
  let values = { ...body, ...{ PlanValidate: tomorrow } };
  let data = await AdminPlan.create(values);
  return data;
};

const GetAll_Planes = async () => {
  let data = await AdminPlan.find();
  return data;
};

const updatePlan = async (id, body) => {
  let values = await AdminPlan.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }
  if (body.Type === 'disable') {
    values = await AdminPlan.findByIdAndUpdate({ _id: id }, { active: false }, { new: true });
    return values;
  } else {
    values = await AdminPlan.findByIdAndUpdate({ _id: id }, { active: true }, { new: true });
    return values;
  }
};

const getPlanForBuyer = async () => {
  let values = await AdminPlan.find({ PlanRole: 'Buyer', active: true });
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'There Is No Plan');
  }
  return values;
};

const getPlanForAdmin = async () => {
  let values = await AdminPlan.find({ PlanRole: 'Seller', active: true });
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'There Is No Plan');
  }
  return values;
};

module.exports = {
  createAdminPlane,
  GetAll_Planes,
  updatePlan,
  getPlanForBuyer,
  getPlanForAdmin,
};
