const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const StreamPlanService = require('../services/StreamPlan.service');

// create stream Plan

const Creact_Stream_Plan = catchAsync(async (req, res) => {
  let userId = req.userId;
  let data = await StreamPlanService.Creact_Stream_Plan(req.body, userId);
  res.send(data).Status(201);
});

const get_Stream_Plan_ById = catchAsync(async (req, res) => {
  const data = await StreamPlanService.get_Stream_Plan_ById(req.params.id);
  res.send(data);
});

const Active_Inactive = catchAsync(async (req, res) => {
  const data = await StreamPlanService.Active_Inactive(req.params.id, req.body);
  res.send(data);
});

const update_StreamPlan = catchAsync(async (req, res) => {
  const data = await StreamPlanService.update_StreamPlan(req.params.id, req.body);
  res.send(data);
});

const fetch_Stream_Planes = catchAsync(async (req, res) => {
  const data = await StreamPlanService.fetch_Stream_Planes(req.params.page, req.params.range);
  res.send(data);
});

const getActive_Planes = catchAsync(async (req, res) => {
  const data = await StreamPlanService.getActive_Planes();
  res.send(data);
});

const Purchase_plan = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await StreamPlanService.Purchase_plan(req.body, userId);
  res.send(data);
});

const getPurchased_Planes = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await StreamPlanService.getPurchased_Planes(userId);
  res.send(data);
});

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
