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

const getStreams = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await RequestStreamService.getStreams(userId);
  res.send(data);
});

const getStreams_Admin_Side = catchAsync(async (req, res) => {
  const data = await RequestStreamService.getStreams_Admin_Side();
  res.send(data);
});

const AdminStream_Approved_Cancel = catchAsync(async (req, res) => {
  const data = await RequestStreamService.AdminStream_Approved_Cancel(req.params.id, req.body);
  res.send(data);
});

const getStreamById = catchAsync(async (req, res) => {
  const data = await RequestStreamService.getStreamById(req.params.id);
  res.send(data);
});

const getApprovedStream_For_Buyers = catchAsync(async (req, res) => {
  const data = await RequestStreamService.getApprovedStream_For_Buyers();
  res.send(data);
});

const CancelStreamById = catchAsync(async (req, res) => {
  const data = await RequestStreamService.CancelStreamById(req.params.id);
  res.send(data);
});

module.exports = {
  createRequestStream,
  getRequsetStreamById,
  UpdateRequestStream,
  getStreams,
  getStreams_Admin_Side,
  AdminStream_Approved_Cancel,
  getStreamById,
  getApprovedStream_For_Buyers,
  CancelStreamById,
};
