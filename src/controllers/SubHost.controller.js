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

module.exports = {
  create_SubHost,
};
