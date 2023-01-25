const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const bodyParser = require('body-parser');
const Amenties = require('../models/amenties.model');

const createAmenties = async (body) => {
  let values = { ...body, ...{ created: moment() } };
  const data = await Amenties.create(values);
  return data;
};

const getAllAmenties = async () => {
  const data = await Amenties.find({ active: true });
  return data;
};

const getAmentiesById = async (id) => {
  const data = await Amenties.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Amenties Not Found');
  }
  return data;
};

module.exports = {
  createAmenties,
  getAllAmenties,
  getAmentiesById,
};
