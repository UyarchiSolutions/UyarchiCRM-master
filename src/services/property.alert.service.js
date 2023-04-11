const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Propalert = require('../models/property.alert.model');
const moment = require('moment');
const { SellerPost } = require('../models/BuyerSeller.model');

const createpropertyalert = async (body, userId) => {
  let exist = await Propalert.findOne({ userId: userId });
  if (exist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already have Alert for this user');
  }
  let data = { ...body, ...{ userId: userId } };
  let values = await Propalert.create(data);
  return values;
};

const UpdateById = async (id, body) => {
  let data = await Propalert.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Property Alert Not Available');
  }
  data = await Propalert.findByIdAndUpdate({ _id: id }, body, { new: true });
  return data;
};

const getAlerts = async (userId) => {
  let values = await Propalert.findOne({ userId: userId }).sort({ createdAt: -1 });
  if (!values) {
    values = { message: '' };
  } else {
    const { area, propertyType, BhkType, availability, parking, shftingDate, furnish, foodType, createdAt } = values;
  }
  // let data = await SellerPost.aggregate([{}]);
  return values;
};

module.exports = {
  createpropertyalert,
  UpdateById,
  getAlerts,
};
