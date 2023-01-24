const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const AdminPlan = require('../models/AdminPlan.model');
const userPlan = require('../models/usersPlane.model');

const createAdminPlane = async (body) => {
  let tomorrow = moment().add(body.PlanValidate, 'days');
  let postvalid = moment().add(body.postValidate, 'days');
  let values = { ...body, ...{ PlanValidate: tomorrow, postValidate: postvalid, created: moment() } };
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

const getPlanesDetails = async (planType, page) => {
  // plane planeTypes (Seller, Buyer)
  let values = await AdminPlan.aggregate([
    {
      $match: {
        PlanRole: planType,
      },
    },
    {
      $lookup: {
        from: 'userplans',
        localField: '_id',
        foreignField: 'PlanId',
        as: 'usedplanes',
      },
    },
    {
      $project: {
        _id: 1,
        active: 1,
        Amount: 1,
        planName: 1,
        PlanValidate: 1,
        postValidate: 1,
        offer: 1,
        ContactNumber: 1,
        PlanRole: 1,
        UsedCount: { $size: '$usedplanes' },
      },
    },
    {
      $skip: 10 * page,
    },
    {
      $limit: 10,
    },
  ]);
  let total = await AdminPlan.aggregate([
    {
      $match: {
        PlanRole: planType,
      },
    },
    {
      $lookup: {
        from: 'userplans',
        localField: '_id',
        foreignField: 'PlanId',
        as: 'usedplanes',
      },
    },
    {
      $project: {
        _id: 1,
        active: 1,
        Amount: 1,
        planName: 1,
        PlanValidate: 1,
        offer: 1,
        ContactNumber: 1,
        PlanRole: 1,
        UsedCount: { $size: '$usedplanes' },
      },
    },
  ]);
  return { values: values, total: total.length };
};

// get plan Details And Users Details

const getPlaneDetailsWithUsers = async (planId) => {
  let values = await userPlan.aggregate([
    {
      $match: {
        PlanId: planId,
      },
    },
    {
      $lookup: {
        from: 'buyers',
        localField: 'userId',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      $unwind: {
        path: '$users',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'adminplans',
        localField: 'PlanId',
        foreignField: '_id',
        as: 'plan',
      },
    },
    {
      $unwind: {
        path: '$plan',
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
  return values;
};

module.exports = {
  createAdminPlane,
  GetAll_Planes,
  updatePlan,
  getPlanForBuyer,
  getPlanForAdmin,
  getPlanesDetails,
  getPlaneDetailsWithUsers,
};
