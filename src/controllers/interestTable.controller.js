const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const interestTableService = require('../services/interestTable.service');

const createinterestService = catchAsync(async (req, res) => {
   const user = await interestTableService.createinterest(req.body);
  res.status(httpStatus.CREATED).send(user);
});


const getinterestServiceById = catchAsync(async (req, res) => {
  const pro = await interestTableService.getInterestById(req.params.interestId);
  if (!pro || pro.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'interest not found');
  }
  res.send(pro);
});

const getinterestServiceAll = catchAsync(async (req, res) => {
    const manage = await interestTableService.getAllInterest(req.params);
    if (!manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'interest Not Available ');
    }
    res.send(manage);
  });


const updateinterestService = catchAsync(async (req, res) => {

  const pro = await interestTableService.updateInterestId(req.params.interestId, req.body);
  res.send(pro);
  await pro.save();
});

const deleteinterestService = catchAsync(async (req, res) => {
  await interestTableService.deleteInterestById(req.params.interestId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createinterestService,
    getinterestServiceById,
    getinterestServiceAll,
    updateinterestService,
    deleteinterestService,
};