const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const supplierAppUser = require('../services/supplierAppUser.service');
const supplierAppUserModel = require('../models/supplierAppUser.model')
const {tokenService} = require('../services');
const { jwt } = require('../config/config');
const { NOT_FOUND } = require('http-status');

const createsupplierAppUserService = catchAsync(async (req, res) => {
    const Buy = await supplierAppUserModel.find();
    let center = '';
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
 
    let userId = '';
    let totalcount = Buy.length + 1;
   
      userId = 'SU' + center + totalcount;
    
    let user;
    if(userId !=''){
   user = await supplierAppUser.createSupplierAppUser(req.body);
    }
    user.secretName = userId;
  res.status(httpStatus.CREATED).send(user);
  await user.save();
});

const login = catchAsync(async (req, res) => {
  const { email, dateOfBirth } = req.body;
  const interviewerRegistration = await supplierAppUser.loginSupplierAppUserEmailAndPassword(email, dateOfBirth);
  const tokens = await tokenService.generateAuthTokens(interviewerRegistration[0]);
  let options = {
    httpOnly : true,
  }
  res.cookie("token", tokens.access.token, options)
  // jwt.verify(req.cookies['token'],);
  res.send({ interviewerRegistration, tokens });
});

const getsupplierAppUserServiceByIdAll = catchAsync(async (req, res) => {
    const pro = await supplierAppUser.getAllSupplierAppUserResponce(req.params.id);
    if (!pro || pro.active === false) {
      throw new ApiError(httpStatus.NOT_FOUND, 'supplierAppUser not found');
    }
    res.send(pro);
  });

  
const getsupplierAppUserServiceByIdAllNotId = catchAsync(async (req, res) => {
  const pro = await supplierAppUser.getAllSupplierAppUserResponceNotId(req.params);
  if (!pro || pro.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'supplierAppUser not found');
  }
  res.send(pro);
});

const getsupplierAppUserServiceById = catchAsync(async (req, res) => {
  const pro = await supplierAppUser.getSupplierAppUserById(req.params.supplierAppUserId);
  if (!pro || pro.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'supplierAppUser not found');
  }
  res.send(pro);
});

const getsupplierAppUserServiceAll = catchAsync(async (req, res) => {
    const manage = await supplierAppUser.getAllSupplierAppUser(req.params);
    if (!manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'supplierAppUser Not Available ');
    }
    res.send(manage);
  });


const updateSupplierAppUserService = catchAsync(async (req, res) => {

  const pro = await supplierAppUser.updateSupplierAppUserId(req.params.supplierAppUserId, req.body);
  res.send(pro);
  await pro.save();
});

const deleteSupplierAppUserService = catchAsync(async (req, res) => {
  await supplierAppUser.deleteSupplierAppUserById(req.params.supplierAppUserId);
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
    createsupplierAppUserService,
    login,
    getsupplierAppUserServiceById,
    getsupplierAppUserServiceAll,
    updateSupplierAppUserService,
    deleteSupplierAppUserService,
    getsupplierAppUserServiceByIdAll,
    getsupplierAppUserServiceByIdAllNotId,
};