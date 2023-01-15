const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const propertVisitService = require('../services/propertyVisit.service');

const createPropertyVisit = catchAsync(async (req, res) => {
  const data = await propertVisitService.createPropertyVisit(req.body);
  res.send(data);
});

const getVisit_PropertyBy_Buyer = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await propertVisitService.getVisit_PropertyBy_Buyer(userId);
  res.send(data);
});

module.exports = {
  createPropertyVisit,
  getVisit_PropertyBy_Buyer,
};
