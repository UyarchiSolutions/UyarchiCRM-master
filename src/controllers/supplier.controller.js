const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const supplierService = require('../services/supplier.service');
const { supplier } = require('../models');
const { tokenService } = require('../services');
const { jwt } = require('../config/config');
const { NOT_FOUND } = require('http-status');

const createSupplierService = catchAsync(async (req, res) => {
  const Buy = await supplier.find({ type: req.body.type });
  let center = '';
  // console.log(Buy.length);
  if (Buy.length < 9) {
    center = '0000';
  }
  if (Buy.length < 99 && Buy.length >= 9) {
    center = '000';
  }
  if (Buy.length < 999 && Buy.length >= 99) {
    center = '00';
  }
  if (Buy.length < 9999 && Buy.length >= 999) {
    center = '0';
  }
  // console.log(center, 0);
  let userId = '';
  let totalcount = Buy.length + 1;
  if (req.body.type == 'buyer') {
    userId = 'BU' + center + totalcount;
  }
  if (req.body.type == 'supplier') {
    userId = 'SU' + center + totalcount;
  }
  let supplierss;
  if (userId != '') {
    supplierss = await supplierService.createSupplier(req.body);
  }
  supplierss.secretName = userId;
  // console.log(supplierss)
  res.status(httpStatus.CREATED).send(supplierss);
  await supplierss.save();
});

const login = catchAsync(async (req, res) => {
  const { email, dateOfBirth } = req.body;
  const data = await supplierService.loginUserEmailAndPassword(email, dateOfBirth);
  const tokens = await tokenService.generateAuthTokens(data[0]);
  let options = {
    httpOnly: true,
  };
  res.cookie('token', tokens.access.token, options);
  // jwt.verify(req.cookies['token'],);
  res.send({ data, tokens });
});

const createSupplierwithType = catchAsync(async (req, res) => {
  const supplier = await supplierService.createSupplierwithType(req.params.type);
  res.send(supplier);
});

const getAllSupplierService = catchAsync(async (req, res) => {
  const supplier = await supplierService.getAllSupplier();
  res.send(supplier);
});

const getAllSupplierDeleteService = catchAsync(async (req, res) => {
  const supplier = await supplierService.getAllSupplierDelete(req.params.page);
  res.send(supplier);
});

const getSupplierByIdService = catchAsync(async (req, res) => {
  const supplier = await supplierService.getSupplierById(req.params.supplierId);
  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier Not Found');
  }
  res.send(supplier);
});

const updateSupplierByIdService = catchAsync(async (req, res) => {
  const supplier = await supplierService.updateSupplierById(req.params.supplierId, req.body);
  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier Not Found');
  }
  res.send(supplier);
});

const changePasswordSupplierByIdService = catchAsync(async (req, res) => {
  const supplier = await supplierService.updateSupplierChangeById(req.params.supplierId, req.body);
  res.send(supplier);
});

const deleteSupplierByIdService = catchAsync(async (req, res) => {
  const supplier = await supplierService.deleteSupplierById(req.params.supplierId);
  res.status(httpStatus.NO_CONTENT).send();
});

const forgetPassword = catchAsync(async (req, res) => {
  const supplier = await supplierService.forgetPassword(req.body);
  res.send(supplier);
});

const otpVerification = catchAsync(async (req, res) => {
  const otp = await supplierService.otpVerification(req.body);
  res.send(otp);
});

const updatePasswordByIdSupplierId = catchAsync(async (req, res) => {
  const changePwd = await supplierService.updatePasswordByIdSupplierId(req.params.id, req.body);
  res.send(changePwd);
});

const getSupplierDetails = catchAsync(async (req, res) => {
  const supplier = await supplierService.getSupplierDetails(req.params.supplierId, req.params.productId, req.params.page);
  res.send(supplier);
});

const getMapLocation = catchAsync(async (req, res) => {
  const supplier = await supplierService.getMapLocation(req.query);
  res.send(supplier);
});

module.exports = {
  createSupplierService,
  getAllSupplierService,
  getSupplierByIdService,
  updateSupplierByIdService,
  deleteSupplierByIdService,
  createSupplierwithType,
  getAllSupplierDeleteService,
  login,
  forgetPassword,
  otpVerification,
  updatePasswordByIdSupplierId,
  changePasswordSupplierByIdService,
  getSupplierDetails,
  getMapLocation,
};
