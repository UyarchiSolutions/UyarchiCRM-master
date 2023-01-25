const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const properBuyerrelation = require('../models/propertyBuyerRelation.model');

const getPropertyBuyerRelations = async (id) => {
  let values = await properBuyerrelation.aggregate([
    {
      $match: {
        propertyId: id,
      },
    },
    {
      $lookup: {
        from: 'buyers',
        localField: 'userId',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$users',
      },
    },
    {
      $lookup: {
        from: 'buyerrenties',
        localField: 'userId',
        foreignField: 'userId',
        as: 'needPost',
      },
    },
    {
      $project: {
        _id: 1,
        active: 1,
        created: 1,
        propertyId: 1,
        userId: 1,
        status: 1,
        history: 1,
        userName: '$users.userName',
        mobile: '$users.mobile',
        email: '$users.email',
        Type: '$users.Type',
        needPost: { $size: '$needPost' },
      },
    },
    {
      $project: {
        _id: 1,
        active: 1,
        created: 1,
        propertyId: 1,
        userId: 1,
        status: 1,
        history: 1,
        userName: 1,
        mobile: 1,
        email: 1,
        Type: 1,
        needPost: { $cond: { if: { $gt: ['$needPost', 0] }, then: 'yes', else: 'no' } },
      },
    },
  ]);
  return values;
};

module.exports = {
  getPropertyBuyerRelations,
};
