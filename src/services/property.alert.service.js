const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Propalert = require('../models/property.alert.model');
const moment = require('moment');

const createpropertyalert = async (body, userId) => {
  let exist = await Propalert.findOne({ userId: userId });
  if (exist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already have Alert for this user');
  }
  let data = { ...body, ...{ userId: userId } };
  let values = await Propalert.create(data);
  return values;
};

module.exports = {
  createpropertyalert,
};
