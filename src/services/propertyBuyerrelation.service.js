const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const properBuyerrelation = require('../models/propertyBuyerRelation.model');
const moment = require('moment/moment');

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

const rejectForSellerSide = async (propId, userId) => {
  let propRelationData = await properBuyerrelation.findOne({ propertyId: propId, userId });
  if (!propRelationData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'this user Not intresed this property');
  }
  propRelationData = await properBuyerrelation.findByIdAndUpdate(
    { _id: propRelationData._id },
    { status: 'Rejected', created: moment().toDate(), $push: { history: { Reject: moment().toDate() } } },
    { new: true }
  );
  return propRelationData;
};

// fixed And Dumbed Property

const FixedAndDumbedProperty = async (propId, userId, type) => {
  let data = await properBuyerrelation.findOne({ propertyId: propId, userId: userId });
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'this User Not Relationed This Propety');
  }
  if (type === 'fixed') {
    data = await properBuyerrelation.findByIdAndUpdate(
      { _id: data._id },
      { status: 'Fixed', created: moment().toDate(), $push: { history: { Fixed: moment().toDate() } } },
      { new: true }
    );
  }
  if (type === 'dumped') {
    data = await properBuyerrelation.findByIdAndUpdate(
      { _id: data._id },
      { status: 'Dumped', created: moment().toDate(), $push: { history: { dumped: moment().toDate() } } },
      { new: true }
    );
  }
  return data;
};

const visiteAndNoShow = async (propId, userId, type) => {
  let data = await properBuyerrelation.findOne({ propertyId: propId, userId: userId });
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This user Not Relation In this Property');
  }
  if (type === 'visited') {
    data = await properBuyerrelation.findByIdAndUpdate(
      { _id: data._id },
      { status: 'Visited', created: moment().toDate(), $push: { history: { visited: moment().toDate() } } },
      { new: true }
    );
  }
  if (type === 'noshow') {
    data = await properBuyerrelation.findByIdAndUpdate(
      { _id: data._id },
      { status: 'NoShow', created: moment().toDate(), $push: { history: { noshow: moment().toDate() } } },
      { new: true }
    );
  }
  return data;
};

module.exports = {
  getPropertyBuyerRelations,
  rejectForSellerSide,
  FixedAndDumbedProperty,
  visiteAndNoShow,
};
