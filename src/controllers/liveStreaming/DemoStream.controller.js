const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const demostream = require('../../services/liveStreaming/DemoStream.service');

const getDatas = catchAsync(async (req, res) => {
  const TechIssue = await demostream.getDatas();
  res.status(httpStatus.OK).send(TechIssue);
});

const get_stream_details = catchAsync(async (req, res) => {
  const TechIssue = await demostream.get_stream_details(req);
  res.status(httpStatus.OK).send(TechIssue);
});

const send_otp = catchAsync(async (req, res) => {
  const TechIssue = await demostream.send_otp(req);
  res.status(httpStatus.OK).send(TechIssue);
});

const verify_otp = catchAsync(async (req, res) => {
  const TechIssue = await demostream.verify_otp(req);
  res.status(httpStatus.OK).send(TechIssue);
});

const select_data_time = catchAsync(async (req, res) => {
  const TechIssue = await demostream.select_data_time(req);
  res.status(httpStatus.OK).send(TechIssue);
});


const add_one_more_time = catchAsync(async (req, res) => {
  const TechIssue = await demostream.add_one_more_time(req);
  res.status(httpStatus.OK).send(TechIssue);
});

const seller_go_live = catchAsync(async (req, res) => {
  const TechIssue = await demostream.seller_go_live(req);
  res.status(httpStatus.OK).send(TechIssue);
});


const seller_go_live_details = catchAsync(async (req, res) => {
  const TechIssue = await demostream.seller_go_live_details(req);
  res.status(httpStatus.OK).send(TechIssue);
});


const start_cloud = catchAsync(async (req, res) => {
  const TechIssue = await demostream.start_cloud(req);
  res.status(httpStatus.OK).send(TechIssue);
});



module.exports = {
  getDatas,
  get_stream_details,
  send_otp,
  verify_otp,
  select_data_time,
  add_one_more_time,
  seller_go_live,
  seller_go_live_details,
  start_cloud
};
