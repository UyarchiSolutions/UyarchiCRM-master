const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const SavedSearch = require('../models/saved.search.model');

const CreateSavedSearch = async (body, userId) => {
  let values = { ...body, ...{ created: moment(), userId: userId } };
  const data = await SavedSearch.create(values);
  return data;
};

const getSavedSearch = async (userId) => {
  const data = await SavedSearch.find({ userId: userId });
  return data;
};

const getSavedSearchById = async (id) => {
  const data = await SavedSearch.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Search Not Found');
  }
  return data;
};

module.exports = {
  CreateSavedSearch,
  getSavedSearch,
  getSavedSearchById,
};
