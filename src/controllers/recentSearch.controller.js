const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const recentSearchService = require('../services/recentSearch.service');

const createRcentSearch = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await recentSearchService.createRcentSearch(req.body, userId);
  res.send(data);
});

const getRecentlysearched = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await recentSearchService.getRecentlysearched(userId);
  res.send(data);
});
module.exports = {
  createRcentSearch,
  getRecentlysearched,
};
