const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const liveStreamservice = require('../services/liveStream.service');

const createliveStream = catchAsync(async (req, res) => {
  // const data = await liveStreamservice.createLiveStream(req.body);
  res.send('not working');
});

const getliveStreamId = catchAsync(async (req, res) => {
  const data = await liveStreamservice.getliveStream(req.params.id);
  if (data.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token Not Available');
  }
  res.send(data[0]);
});
const getAllliveStriming = catchAsync(async (req, res) => {
  const data = await liveStreamservice.getAllliveStriming(req.params.page);
  res.send(data);
});
const updatetoken = catchAsync(async (req, res) => {
  const data = await liveStreamservice.updatetoken(req.params.id, req.body);
  res.send('not working');
});
const getAllliveStrimingapproved = catchAsync(async (req, res) => {
  const data = await liveStreamservice.getAllliveStrimingapproved(req.params.uId);
  res.send(data);
});
const getBuyerWatch = catchAsync(async (req, res) => {
  const data = await liveStreamservice.getBuyerWatch(req.params.uId);
  res.send(data);
});

const getAllBuyerMatch = catchAsync(async (req, res) => {
  const data = await liveStreamservice.getAllBuyerMatch(req.params.id);
  res.send(data);
});

const getAllSUpplierMatch = catchAsync(async (req, res) => {
  const data = await liveStreamservice.getAllSUpplierMatch(req.params.id);
  res.send(data);
});

const updateBuyer = catchAsync(async (req, res) => {
  const data = await liveStreamservice.updateBuyerId(req.params.id, req.body);
  res.send(data);
});

const updateReject = catchAsync(async (req, res) => {
  const data = await liveStreamservice.updateRejectData(req.params.id, req.body);
  res.send(data);
});

const getAllRejected = catchAsync(async (req, res) => {
  const data = await liveStreamservice.getallRejected(req.params.userId);
  res.send(data);
});

const remove_specific_buyer = catchAsync(async (req, res) => {
  const data = await liveStreamservice.remove_specific_buyer(req.params.id, req.body);
  res.send(data);
});

const send_Active_Buyer = catchAsync(async (req, res) => {
  const data = await liveStreamservice.send_Active_Buyer(req.params.id, req.body);
  res.send(data);
});

module.exports = {
  createliveStream,
  getliveStreamId,
  getAllliveStriming,
  updatetoken,
  getAllliveStrimingapproved,
  getBuyerWatch,
  getAllBuyerMatch,
  getAllSUpplierMatch,
  updateBuyer,
  updateReject,
  getAllRejected,
  remove_specific_buyer,
  send_Active_Buyer,
};
