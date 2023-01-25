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
      },
    },
  ]);
  return values;
};

module.exports = {
  getPropertyBuyerRelations,
};
