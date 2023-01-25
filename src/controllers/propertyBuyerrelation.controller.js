const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const propertyBuyerRelation = require('../services/propertyBuyerrelation.service');

const getPropertyBuyerRelations = catchAsync(async (req, res) => {
  const data = await propertyBuyerRelation.getPropertyBuyerRelations(req.params.id);
  res.send(data);
});

module.exports = {
  getPropertyBuyerRelations,
};
