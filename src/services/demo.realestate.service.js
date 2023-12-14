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



const image_upload_multiple = async (req, res) => {
  let id = req.params.id;
  if (!req.files) {
    throw new ApiErrirError(httpStatus.BAD_REQUEST, 'Please Select And Upload At Least One Image');
  }
  let images = await multible_image_array(req.files);

  let findById = await DemoPost.findByIdAndUpdate({ _id: id }, { imageArr: images }, { new: true });

  return findById;

};


const multible_image_array = (filePaths) => {
  const uploadPromises = filePaths.map(async (filePath, index) => await uploadToS3(filePath, index));
  let urls = [];
  return Promise.all(uploadPromises)
    .then((results) => {
      results.forEach((result) => {
        urls.push(result);
      });
      return urls;
    })
    .catch((error) => {
      console.error(error);
    });
};


function uploadToS3(filePath) {
  const s3 = new AWS.S3({
    accessKeyId: 'AKIA3323XNN7Y2RU77UG',
    secretAccessKey: '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',
    region: 'ap-south-1',
  });

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: 'realestatevideoupload',
      Key: filePath.originalname, // Key under which the file will be stored in S3
      Body: filePath.buffer,
    };
    s3.upload(params, (err, data) => {
      if (err) {
        reject(``);
      } else {
        resolve(data.Location);
      }
    });
  });
}

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

const get_my_post = async (req) => {
  let userId = req.query.id;
  let date = new Date().getTime();
  let values = await DemoPost.aggregate([
    { $match: { $and: [{ userId: { $eq: userId } }, { finish: { $eq: true } }] } },
    {
      $lookup: {
        from: 'demostreamhis',
        localField: 'runningStream',
        foreignField: '_id',
        as: 'demostreamhis',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$demostreamhis',
      },
    },
    {
      $lookup: {
        from: 'demostreamhis',
        localField: '_id',
        foreignField: 'streamId',
        pipeline: [
          { $group: { _id: null, count: { $sum: 1 } } }
        ],
        as: 'demostreamhis_count',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$demostreamhis_count',
      },
    },
    {
      $addFields: {
        userName: "$demousers.userName",
        mobileNumber: "$demousers.mobileNumber",
        locationss: "$demousers.location",
        mail: "$demousers.mail",
        start: "$demostreamhis.start",
        end: "$demostreamhis.end",
        actualEnd: "$demostreamhis.actualEnd",
        streamStatus: "$demostreamhis.status",
        agoraAppId: "$demostreamhis.agoraAppId",
        streamID: "$demostreamhis._id",
        Number_of_streams: { $ifNull: ["$demostreamhis_count.count", 0] }
      },
    },
    { $unset: "demostreamhis" },
    { $unset: "demostreamhis_count" }


  ])
  return values;
};


module.exports = {
  createDemoUser,
  createDemoPost,
  updatePostById,
  imageUploadForPost,
  getUsers,
  image_upload_multiple,
  get_my_post
};
