const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const SubHostService = require('../services/SubHost.service');

// create Sub host

const create_SubHost = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await SubHostService.create_SubHost(req.body, userId);
  res.send(data);
});

const get_created_Subhost_By_Seller = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await SubHostService.get_created_Subhost_By_Seller(userId);
  res.send(data);
});

const Active_Inactive_SubHost = catchAsync(async (req, res) => {
  const data = await SubHostService.Active_Inactive_SubHost(req.params.id, req.body);
  res.send(data);
});

const updateSubHost = catchAsync(async (req, res) => {
  const data = await SubHostService.updateSubHost(req.params.id, req.body);
  res.send(data);
});

const getSubHostById = catchAsync(async (req, res) => {
  const data = await SubHostService.getSubHostById(req.params.id);
  res.send(data);
});

module.exports = {
  create_SubHost,
  get_created_Subhost_By_Seller,
  Active_Inactive_SubHost,
  updateSubHost,
  getSubHostById,
};
