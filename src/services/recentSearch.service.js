const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const RecentSearch = require('../models/recentSearch.model');
const moment = require('moment');

const createRcentSearch = async (body, userId) => {
  const data = { ...body, ...{ created: moment(), userId: userId } };
  const recentSearch = await RecentSearch.create(data);
  return recentSearch;
};

module.exports = {
  createRcentSearch,
};
