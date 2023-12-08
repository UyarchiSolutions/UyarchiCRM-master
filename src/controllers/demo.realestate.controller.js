const catchAsync = require('../utils/catchAsync');
const DemoUserService = require('../services/demo.realestate.service');

const createDemoUser = catchAsync(async (req, res) => {
  const data = await DemoUserService.createDemoUser(req);
  res.send(data);
});

const createDemoPost = catchAsync(async (req, res) => {
  const data = await DemoUserService.createDemoPost(req);
  res.send(data);
});

const updatePostById = catchAsync(async (req, res) => {
  const data = await DemoUserService.updatePostById(req);
  res.send(data);
});

const imageUploadForPost = catchAsync(async (req, res) => {
  const data = await DemoUserService.imageUploadForPost(req);
  res.send(data);
});

const image_upload_multiple = catchAsync(async (req, res) => {
  const data = await DemoUserService.image_upload_multiple(req);
  res.send(data);
});


const getUsers = catchAsync(async (req, res) => {
  const data = await DemoUserService.getUsers(req);
  res.send(data);
});

module.exports = {
  createDemoUser,
  createDemoPost,
  updatePostById,
  imageUploadForPost,
  getUsers,
  image_upload_multiple
};
