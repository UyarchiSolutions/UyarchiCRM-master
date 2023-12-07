const httpStatus = require('http-status');
const { DemoPost, DemoUser } = require('../models/demo.realestate.model');
const ApiError = require('../utils/ApiError');
const AWS = require('aws-sdk');

const createDemoUser = async (req) => {
  let findByMobile = await DemoUser.findOne({ mobileNumber: req.body.mobileNumber });
  if (findByMobile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Demo User Already Registered For This Number ');
  }
  let findByMail = await DemoUser.findOne({ mail: req.body.mail });
  if (findByMail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Demo User Already Registered For This E-mail ');
  }
  let creations = await DemoUser.create(req.body);
  return creations;
};

const createDemoPost = async (req) => {
  let findbyUser = await DemoUser.findById(req.body.userId);
  if (!findbyUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Found');
  }
  let creations = await DemoPost.create(req.body);
  return creations;
};

const updatePostById = async (req, res) => {
  let findById = await DemoPost.findById(req.params.id);
  if (!findById) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Post Not Found');
  }
  findById = await DemoPost.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
  return findById;
};

const imageUploadForPost = async (req, res) => {
  let id = req.params.id;
  if (!req.file) {
    throw new ApiErrirError(httpStatus.BAD_REQUEST, 'Please Select And Upload At Least One Image');
  }
  const s3 = new AWS.S3({
    accessKeyId: 'AKIA3323XNN7Y2RU77UG',
    secretAccessKey: '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',
    region: 'ap-south-1',
  });
  return new Promise((resolve, reject) => {
    let params = {
      Bucket: 'realestatevideoupload',
      Key: req.file.originalname,
      Body: req.file.buffer,
    };
    s3.upload(params, async (err, data) => {
      if (err) {
        reject(err);
      } else {
        let findById = await DemoPost.findByIdAndUpdate({ _id: id }, { image: data.Location }, { new: true });
        resolve(findById);
      }
    });
  });
};

const getUsers = async (req) => {
  let values = await DemoUser.aggregate([
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);
  return values;
};

module.exports = {
  createDemoUser,
  createDemoPost,
  updatePostById,
  imageUploadForPost,
  getUsers,
};
