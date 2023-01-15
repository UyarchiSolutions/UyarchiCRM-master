const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const hostregService = require('../services/hostreg.service');
const { tokenService } = require('../services');
const { jwt } = require('../config/config');
const { NOT_FOUND } = require('http-status');

const createhostService = catchAsync(async (req, res) => {
  const { body } = req;
  const attach = await hostregService.createHost(body);
  console.log(req.files);
  if (req.files) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
      path = 'resumes/host/'+ files.filename;
      // console.log(files.filename)
    });

    attach.image = path;
  }
  res.status(httpStatus.CREATED).send(attach);
  await attach.save();
});

const login = catchAsync(async (req, res) => {
  const { email, mobileNumber } = req.body;
  const data = await hostregService.loginhostEmailAndPassword(email, mobileNumber);
  const tokens = await tokenService.generateAuthTokens(data);
  let options = {
    httpOnly: true,
  };
  res.cookie('token', tokens.access.token, options);
  // jwt.verify(req.cookies['token'],);
  res.send({ data, tokens });
});

const createhostProductService = catchAsync(async (req, res) => {
  const { body } = req;
  const attach = await hostregService.createHostProduct(body);
  // console.log(req.files)
  if (req.files) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
      path = 'images/hostProduct/'+ files.filename;
      console.log(files.filename)
    });

    attach.image = path;
  }
  res.status(httpStatus.CREATED).send(attach);
  await attach.save();
});

const createHostStremingService = catchAsync(async (req, res) => {
  const user = await hostregService.createHostStreaming(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getAllHost = catchAsync(async (req, res) => {
  const data = await hostregService.hostAll();
  res.send(data);
});

const getAll = catchAsync(async (req, res) => {
  const data = await hostregService.getAll();
  res.send(data);
});

const RecipentAll = catchAsync(async (req, res) => {
  const data = await hostregService.RecipentAll();
  res.send(data);
});

const getAllLiveStremingDatas = catchAsync(async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  const data = await hostregService.getAllLiveStremingDatas(userId);
  res.send(data);
});

const getAllLiveStremingDatasSame = catchAsync(async (req, res) => {
  const data = await hostregService.getAllLiveStremingDatasSame(req.params.id);
  res.send(data);
});

const getAllproductById = catchAsync(async (req, res) => {
  const data = await hostregService.getAllproductById(req.params.id);
  res.send(data);
});

const getAllStreamingId = catchAsync(async (req, res) => {
  const data = await hostregService.getAllStreaming(req.params.id);
  res.send(data);
});

const getAllStreamingToken = catchAsync(async (req, res) => {
  let userid = req.userId;
  const data = await hostregService.getAllStreamingToken(req.params.id);
  res.send(data);
});

const getliveProduct = catchAsync(async (req, res) => {
  const data = await hostregService.getliveProduct(req.params.id);
  res.send(data);
});

const liveUpdations = catchAsync(async (req, res) => {
  const data = await hostregService.liveUpdations(req.params.id, req.body);
  res.send(data);
});

const getUserProductLive = catchAsync(async (req, res) => {
  let userid = req.userId;
  const data = await hostregService.getUserProductLive(userid);
  res.send(data);
});

const getproductById = catchAsync(async (req, res) => {
  const data = await hostregService.getproductById(req.params.id);
  res.send(data);
});

const recipientAdd = catchAsync(async (req, res) => {
  const data = await hostregService.recipientAdd(req.params.id, req.body);
  res.send(data);
});

const recipientRemove = catchAsync(async (req, res) => {
  const data = await hostregService.recipientRemove(req.params.id, req.body);
  res.send(data);
});

const getsubStreamingData = catchAsync(async (req, res) => {
  const userId = req.userId;
  const data = await hostregService.getsubStreamingData(userId, req.body);
  res.send(data);
});
module.exports = {
  createhostService,
  login,
  createhostProductService,
  createHostStremingService,
  getAllHost,
  getAllLiveStremingDatas,
  getAllLiveStremingDatasSame,
  getAllproductById,
  RecipentAll,
  getAllStreamingId,
  getAllStreamingToken,
  getAll,
  getliveProduct,
  liveUpdations,
  getUserProductLive,
  getproductById,
  recipientAdd,
  recipientRemove,
  getsubStreamingData,
};
