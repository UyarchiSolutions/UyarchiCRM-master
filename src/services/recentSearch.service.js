const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const RecentSearch = require('../models/recentSearch.model');
const moment = require('moment');

const createRcentSearch = async (body, userId) => {
  const { BHKType, HouseOrCommercialType, MonthlyRentFrom, MonthlyRentTo, Type, area, propertType } = body;
  let data = { ...{ created: moment(), userId: userId } };
  if (!BHKType == '' || !BHKType == null) {
    data = { ...data, ...{ BHKType: BHKType } };
  }
  if (!HouseOrCommercialType == '' || !HouseOrCommercialType == null) {
    data = { ...data, ...{ HouseOrCommercialType: HouseOrCommercialType } };
  }
  if (!MonthlyRentFrom == '' || !MonthlyRentFrom == null) {
    data = { ...data, ...{ MonthlyRentFrom: MonthlyRentFrom } };
  }
  if (!MonthlyRentTo == '' || !MonthlyRentTo == null) {
    data = { ...data, ...{ MonthlyRentTo: MonthlyRentTo } };
  }
  if (!Type == '' || !Type == null) {
    data = { ...data, ...{ Type: Type } };
  }
  if (!area == '' || !area == null) {
    data = { ...data, ...{ area: area } };
  }
  if (!propertType == '' || !propertType == null) {
    data = { ...data, ...{ propertType: propertType } };
  }
  const recentSearch = await RecentSearch.create(data);
  return recentSearch;
};

const getRecentlysearched = async (userId) => {
  const data = await RecentSearch.find({ userId: userId }).sort({ created: -1 }).limit(5);
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
