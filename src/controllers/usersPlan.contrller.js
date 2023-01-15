const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const userPlanService = require('../services/usersPlan.service');

const createuserPlan = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await userPlanService.createUserPlan(req.body, userId);
  res.send(data);
});

const getLatestUserPlan = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await userPlanService.getLatestUserPlan(userId);
  res.send(data);
});

module.exports = {
  createuserPlan,
  getLatestUserPlan,
};
