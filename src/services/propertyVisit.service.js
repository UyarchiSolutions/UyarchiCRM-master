const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const propertyVisit = require('../models/propertyVisit.model');
const { Buyer } = require('../models/BuyerSeller.model');
const moment = require('moment');

const createPropertyVisit = async (body) => {
  const data = { ...body, ...{ created: moment() } };
  const values = await propertyVisit.create(data);
  return values;
};

const getVisit_PropertyBy_Buyer = async (userId) => {
  const values = await propertyVisit.aggregate([
    {
      $match: { userId: userId },
    },
    {
      $lookup: {
        from: 'sellerposts',
        localField: 'propertyId',
        foreignField: '_id',
        as: 'property',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$property',
      },
    },
    {
      $project: {
        propertyId: '$property._id',
        Accept: '$property.Accept',
        Ignore: '$property.Ignore',
        viewedUsers: '$property.viewedUsers',
        WhishList: '$property.WhishList',
        intrestedUsers: '$property.intrestedUsers',
        AdditionalDetails: '$property.AdditionalDetails',
        image: '$property.image',
        active: '$property.active',
        propertyExpired: '$property.propertyExpired',
        propStatus: '$property.propStatus',
        HouseOrCommercialType: '$property.HouseOrCommercialType',
        Type: '$property.Type',
        propertType: '$property.propertType',
        BuildingName: '$property.BuildingName',
        ageOfBuilding: '$property.ageOfBuilding',
        BHKType: '$property.BHKType',
        landSize: '$property.landSize',
        BuildedSize: '$property.BuildedSize',
        buildingDirection: '$property.buildingDirection',
        availability: '$property.availability',
        RentPrefer: '$property.RentPrefer',
        discription: '$property.discription',
        noOfFloor: '$property.noOfFloor',
        floorNo: '$property.floorNo',
        propertStatus: '$propery.propertStatus',
        Address: '$property.Address',
        city: '$property.city',
        locality: '$property.locality',
        pineCode: '$property.pineCode ',
        lat: '$property.lat',
        long: '$property.long',
        parkingFacilities: '$property.parkingFacilities',
        furnishingStatus: '$property.furnishingStatus',
        bathRoomCount: '$property.bathRoomCount',
        bathRoomType: '$property.bathRoomType',
        balconyCount: '$property.balconyCount',
        roomType: '$property.roomType',
        floorType: '$property.floorType',
        MonthlyRentFrom: '$property.MonthlyRentFrom',
        depositeAmount: '$property.depositeAmount',
        Negociable: '$property.Negociable',
        maintainenceCost: '$property.maintainenceCost',
        MaintenanceStatus: '$property.MaintenanceStatus',
        ifMaintenence: '$property.ifMaintenence',
        AcceptStatus: {
          $ifNull: [{ $map: { input: '$property.Accept', as: 'value', in: { $eq: ['$$value', userId] } } }, []],
        },
        IgnoreStatus: {
          $ifNull: [{ $map: { input: '$property.Ignore', as: 'value', in: { $eq: ['$$value', userId] } } }, []],
        },
        created: '$property.created',
        date: '$property.date',
        userId: '$property.userId',
        propertyExpiredDate: '$property.propertyExpiredDate',
        visitDate_Time: 1,
      },
    },
    {
      $project: {
        propertyId: 1,
        propertyExpiredDate: 1,
        userId: 1,
        date: 1,
        created: 1,
        ifMaintenence: 1,
        MaintenanceStatus: 1,
        maintainenceCost: 1,
        Negociable: 1,
        depositeAmount: 1,
        MonthlyRentFrom: 1,
        floorType: 1,
        roomType: 1,
        balconyCount: 1,
        bathRoomType: 1,
        bathRoomCount: 1,
        furnishingStatus: 1,
        parkingFacilities: 1,
        long: 1,
        lat: 1,
        pineCode: 1,
        locality: 1,
        city: 1,
        Address: 1,
        propertStatus: 1,
        Accept: 1,
        Ignore: 1,
        viewedUsers: 1,
        WhishList: 1,
        intrestedUsers: 1,
        AdditionalDetails: 1,
        image: 1,
        active: 1,
        propertyExpired: 1,
        propStatus: 1,
        HouseOrCommercialType: 1,
        Type: 1,
        propertType: 1,
        BuildingName: 1,
        ageOfBuilding: 1,
        BHKType: 1,
        landSize: 1,
        BuildedSize: 1,
        buildingDirection: 1,
        availability: 1,
        RentPrefer: 1,
        discription: 1,
        AcceptStatus: { $cond: { if: { $in: [true, '$AcceptStatus'] }, then: true, else: false } },
        IgnoreStatus: { $cond: { if: { $in: [true, '$IgnoreStatus'] }, then: true, else: false } },
        noOfFloor: 1,
        floorNo: 1,
        visitDate_Time: 1,
      },
    },
  ]);
  return values;
};

module.exports = {
  createPropertyVisit,
  getVisit_PropertyBy_Buyer,
};
