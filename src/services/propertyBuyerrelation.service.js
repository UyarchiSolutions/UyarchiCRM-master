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
      $lookup: {
        from: 'buyerrenties',
        localField: 'userId',
        foreignField: 'userId',
        as: 'buyerposts',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$buyerposts',
      },
    },
    {
      $lookup: {
        from: 'sellerposts',
        localField: 'propertyId',
        foreignField: '_id',
        as: 'sellerposts',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$sellerposts',
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
        buyerProperty: '$buyerposts',
        needPost: { $size: '$needPost' },
        sellerposts: '$sellerposts',
        //sellerType
        BHKMatch: { $cond: { if: { $eq: ['$buyerposts.BHKType', 'sellerposts.BHKType'] }, then: 20, else: 0 } },
        TypeMatch: { $cond: { if: { $eq: ['$sellerposts.Type', '$buyerposts.sellerType'] }, then: 20, else: 0 } },
        priceMatch: {
          $cond: {
            if: {
              $gte: ['$buyerposts.FromPrice', '$sellerposts.MonthlyRentFrom'],
            },
            then: 20,
            else: 0,
          },
        },
        cityMatch: { $cond: { if: { $eq: ['$sellerposts.city', '$buyerposts.PrefferedCities'] }, then: 30, else: 0 } },
        areaMatch: { $cond: { if: { $eq: ['$sellerposts.locality', '$buyerposts.Locality'] }, then: 20, else: 10 } },
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
        buyerProperty: 1,
        sellerposts: '$sellerposts',
        needPost: { $cond: { if: { $gt: ['$needPost', 0] }, then: 'yes', else: 'no' } },
        BHKMatch: 1,
        TypeMatch: 1,
        priceMatch: 1,
        cityMatch: 1,
        areaMatch: 1,
        matchPercentage: { $add: ['$BHKMatch', '$TypeMatch', '$priceMatch', '$cityMatch', '$areaMatch'] },
      },
    },
  ]);
  return values;
};

module.exports = {
  getPropertyBuyerRelations,
};
