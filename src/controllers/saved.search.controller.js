const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const SavedSearchService = require('../services/saved.search.service');

const CreateSavedSearch = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await SavedSearchService.CreateSavedSearch(req.body, userId);
  res.send(data);
});

const getSavedSearch = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await SavedSearchService.getSavedSearch(userId);
  res.send(data);
});

const getSavedSearchById = catchAsync(async (req, res) => {
  const data = await SavedSearchService.getSavedSearchById(req.params.id);
  res.send(data);
});

module.exports = {
  CreateSavedSearch,
  getSavedSearch,
  getSavedSearchById,
};
