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

module.exports = {
  getDatas,
  get_stream_details,
  send_otp
};
