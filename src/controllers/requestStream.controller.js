const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const RequestStreamService = require('../services/requestStream.service');

// create Request Stream

const createRequestStream = catchAsync(async (req, res) => {
  let userId = req.userId;
  let data = await RequestStreamService.createRequestStream(req.body, userId);
  res.send(data);
});

// Fetch Request Stream By Id

const getRequsetStreamById = catchAsync(async (req, res) => {
  let data = await RequestStreamService.getRequsetStreamById(req.params.id);
  res.send(data);
});

// update Request Stream By Id

const UpdateRequestStream = catchAsync(async (req, res) => {
  let data = await RequestStreamService.UpdateRequestStream(req.params.id, req.body);
  res.send(data);
});

module.exports = {
  createRequestStream,
  getRequsetStreamById,
  UpdateRequestStream,
};
