const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const  menuesService  = require('../services/menue.service');

const createMenues = catchAsync(async (req, res) => {
  const menue = await menuesService.createMenues(req.body);
  res.status(httpStatus.CREATED).send(menue);
});

const getMenuesById = catchAsync(async (req, res) => {
  const menue = await menuesService.getMenuesById(req.params.menueId);
  res.send(menue);
});

const getAllMenues = catchAsync(async (req, res) => {
  const menue = await menuesService.getAllMenues(req.params);
  res.send(menue);
});

const updateMenuesById = catchAsync(async (req, res) => {
  const menue = await menuesService.updateMenuesById(req.params.menueId, req.body);
  res.send(menue);
});

const deleteMenueById = catchAsync(async (req, res) => {
  await menuesService.deleteMenueById(req.params.menueId);
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
  createMenues,
  getAllMenues,
  getMenuesById,
  updateMenuesById,
  deleteMenueById,
};
