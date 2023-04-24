const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const RequestStream = require('../models/requestStream.model');

// create Request Stream

const createRequestStream = async (body) => {
  let data = await RequestStream.create(body);
  return data;
};

// Fetch request Stream By Id

const getRequsetStreamById = async (id) => {
  let data = await RequestStream.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Requset Stream Not Found');
  }
  return data;
};

// update Request stream
const UpdateRequestStream = async (id, body) => {
  let data = await RequestStream.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request Stream Not Found');
  }
  data = await RequestStream.findByIdAndUpdate({ _id: id }, { body }, { new: true });
  return data;
};

module.exports = {
  createRequestStream,
  getRequsetStreamById,
  UpdateRequestStream,
};
