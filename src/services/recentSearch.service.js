const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const RecentSearch = require('../models/recentSearch.model');
const moment = require('moment');

const createRcentSearch = async (body, userId) => {
  const { BHKType, HouseOrCommercialType, MonthlyRentFrom, MonthlyRentTo, Type, area, propertType } = body;
  let data = { ...body, ...{ created: moment(), userId: userId } };
  const recentSearch = await RecentSearch.create(data);
  return recentSearch;
};

const getRecentlysearched = async (userId) => {
  const data = await RecentSearch.find({ userId: userId }).sort({ created: -1 }).limit(10);
  return data;
};

const getRecentlysearchedById = async (id) => {
  const data = await RecentSearch.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'There Is no recent Search Available');
  }
  return data;
};

module.exports = {
  createRcentSearch,
  getRecentlysearched,
  getRecentlysearchedById,
};
