const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Amenties = require('../services/amenties.service');

const createAmenties = catchAsync(async (req, res) => {
  const data = await Amenties.createAmenties(req.body);
  res.send(data);
});

const getAllAmenties = catchAsync(async (req, res) => {
  const data = await Amenties.getAllAmenties();
  res.send(data);
});

const getAmentiesById = catchAsync(async (req, res) => {
  const data = await Amenties.getAmentiesById(req.params.id);
  res.send(data);
});

module.exports = {
  createAmenties,
  getAllAmenties,
  getAmentiesById,
};
