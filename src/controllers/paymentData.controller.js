const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const paymentDataService = require('../services/paymentData.service');

const createpaymentDataService = catchAsync(async (req, res) => {
   const user = await paymentDataService.createpaymentData(req.body);
  res.status(httpStatus.CREATED).send(user);
});


const getpaymentDataServiceById = catchAsync(async (req, res) => {
  const pro = await paymentDataService.getpaymentDataById(req.params.paymentId);
  if (!pro || pro.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }
  res.send(pro);
});

const getpaymentDataServiceAll = catchAsync(async (req, res) => {
    const manage = await paymentDataService.getAllpaymentData(req.params);
    if (!manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Payment Not Available ');
    }
    res.send(manage);
  });


const updatepaymentDataService = catchAsync(async (req, res) => {

  const pro = await paymentDataService.updatepaymentDataId(req.params.paymentId, req.body);
  res.send(pro);
  await pro.save();
});

const deletepaymentDataService= catchAsync(async (req, res) => {
  await paymentDataService.deletepaymentDataById(req.params.paymentId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createpaymentDataService,
    getpaymentDataServiceById,
    getpaymentDataServiceAll,
    updatepaymentDataService,
    deletepaymentDataService,
};