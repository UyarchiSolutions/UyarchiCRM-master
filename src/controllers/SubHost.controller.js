const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const SubHostService = require('../services/SubHost.service');
const { authService, userService, tokenService, emailService } = require('../services');

// create Sub host

const create_SubHost = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await SubHostService.create_SubHost(req.body, userId);
  res.send(data);
});

const get_created_Subhost_By_Seller = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await SubHostService.get_created_Subhost_By_Seller(userId);
  res.send(data);
});

const Active_Inactive_SubHost = catchAsync(async (req, res) => {
  const data = await SubHostService.Active_Inactive_SubHost(req.params.id, req.body);
  res.send(data);
});

const updateSubHost = catchAsync(async (req, res) => {
  const data = await SubHostService.updateSubHost(req.params.id, req.body);
  res.send(data);
});

const getSubHostById = catchAsync(async (req, res) => {
  const data = await SubHostService.getSubHostById(req.params.id);
  res.send(data);
});

const sendOtpTOSubHost = catchAsync(async (req, res) => {
  const data = await SubHostService.sendOtpTOSubHost(req.body);
  res.send(data);
});

const verifyOtpforSubhost = catchAsync(async (req, res) => {
  const data = await SubHostService.verifyOtpforSubhost(req.body);
  res.send(data);
});

const setPassword = catchAsync(async (req, res) => {
  const data = await SubHostService.setPassword(req.params.id, req.body);
  res.send(data);
});

const Login = catchAsync(async (req, res) => {
  const data = await SubHostService.Login(req.body);
  let token = await tokenService.generateAuthTokens(data);
  res.send({ data, token });
});

const getSubHostForChat = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await SubHostService.getSubHostForChat(userId);
  res.send(data);
});

const getSubHostForStream = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await SubHostService.getSubHostForStream(userId);
  res.send(data);
});

const getSubHostBy_Login = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await SubHostService.getSubHostBy_Login(userId);
  res.send(data);
});

const getStream_By_SubHost = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await SubHostService.getStream_By_SubHost(userId);
  res.send(data);
});

const changePassword = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await SubHostService.changePassword(req.body, userId);
  res.send(data);
});

module.exports = {
  create_SubHost,
  get_created_Subhost_By_Seller,
  Active_Inactive_SubHost,
  updateSubHost,
  getSubHostById,
  sendOtpTOSubHost,
  verifyOtpforSubhost,
  setPassword,
  Login,
  getSubHostForChat,
  getSubHostForStream,
  getSubHostBy_Login,
  getStream_By_SubHost,
  changePassword,
};
