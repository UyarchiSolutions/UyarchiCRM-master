const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const propertyAlertService = require('../services/property.alert.service');

const createpropertyalert = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await propertyAlertService.createpropertyalert(req.body, userId);
  res.send(data);
});

module.exports = {
  createpropertyalert,
};
