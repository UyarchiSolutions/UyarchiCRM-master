const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const propertyBuyerRelation = require('../services/propertyBuyerrelation.service');

const getPropertyBuyerRelations = catchAsync(async (req, res) => {
  const data = await propertyBuyerRelation.getPropertyBuyerRelations(req.params.id);
  res.send(data);
});

const rejectForSellerSide = catchAsync(async (req, res) => {
  const data = await propertyBuyerRelation.rejectForSellerSide(req.params.propId, req.params.userId);
  res.send(data);
});

const FixedAndDumbedProperty = catchAsync(async (req, res) => {
  const data = await propertyBuyerRelation.FixedAndDumbedProperty(req.params.propId, req.params.userId, req.params.type);
  res.send(data);
});

const visiteAndNoShow = catchAsync(async (req, res) => {
  const data = await propertyBuyerRelation.visiteAndNoShow(req.params.propId, req.params.userId, req.params.type);
  res.send(data);
});

module.exports = {
  getPropertyBuyerRelations,
  rejectForSellerSide,
  FixedAndDumbedProperty,
  visiteAndNoShow,
};
