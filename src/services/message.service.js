const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { Messages } = require('../models/message.model');

const getchtting_message = async (id) => {
  let values = await Messages.aggregate([
    {
      $match: {
        roomId: id,
      },
    },
    {
      $lookup: {
        from: 'requirementsuppliers',
        localField: 'roomId',
        foreignField: '_id',
        as: 'orderData',
      },
    },
    {
      $unwind: '$orderData',
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'userData',
      },
    },
    {
      $unwind: '$userData',
    },
    {
      $project: {
        _id: 1,
        message: 1,
        product: '$orderData.product',
        userName: '$userData.primaryContactName',
      },
    },
  ]);
  return values;
};

module.exports = {
  getchtting_message,
};
