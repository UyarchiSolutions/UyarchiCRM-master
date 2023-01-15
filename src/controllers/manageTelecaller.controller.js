const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const manageTelecallerService = require('../services/manageTelecaller.service');
const {tokenService} = require('../services');
const { jwt } = require('../config/config');
const { NOT_FOUND } = require('http-status');

const createmanageTelecallerService = catchAsync(async (req, res) => {
  const user = await manageTelecallerService.createManage(req.body);
  res.status(httpStatus.CREATED).send(user);
 
});

const login = catchAsync(async (req, res) => {
  const { email, dateOfBirth } = req.body;
  const data = await manageTelecallerService.loginManageUserEmailAndPassword(email, dateOfBirth);
  const tokens = await tokenService.generateAuthTokens(data[0]);
  let options = {
    httpOnly : true,
  }
  res.cookie("token", tokens.access.token, options)
  // jwt.verify(req.cookies['token'],);
  res.send({ data, tokens });
});

const getmanageTeleServiceById = catchAsync(async (req, res) => {
  const data = await manageTelecallerService.ManageId(req.params.id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'manageTelecaller not found');
  }
  res.send(data);
});

const getmanageTeleServiceAll = catchAsync(async (req, res) => {
  const data = await manageTelecallerService.ManageAll(req.params);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'manageTelecaller not found');
  }
  res.send(data);
});


const deletemanageAttendanceService = catchAsync(async (req, res) => {
    await manageTelecallerService.deletemanageAttendance(req.params.id);
    res.status(httpStatus.NO_CONTENT).send();
  });

  const updateManageAttendance = catchAsync(async (req, res) => {
    const manageIssues = await manageTelecallerService.updatemanageAttendance(req.params.id, req.body);
    res.send(manageIssues);
  });


module.exports = {
    createmanageTelecallerService,
    login,
    getmanageTeleServiceById,
    deletemanageAttendanceService,
    updateManageAttendance,
    getmanageTeleServiceAll,
  };