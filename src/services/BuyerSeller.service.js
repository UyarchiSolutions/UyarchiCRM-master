const httpStatus = require('http-status');
const { BuyerSeller, BuyerSellerOTP, SellerPost, BuyerRentie, Buyer, PropertLikes } = require('../models/BuyerSeller.model');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const Admin = require('../models/RealEstate.Admin.model');
const OTP = require('../config/textLocal');
const subHostOTP = require('../config/subHostOTP');
const StoreOtp = require('../models/RealEstate.Otp.model');
const userPlane = require('../models/usersPlane.model');
const AdminPlan = require('../models/AdminPlan.model');
const { ViewedDetails, whishListDetails, shortList, SellerNotification } = require('../models/BuyerPropertyRelation.model');
const PropertyBuyerRelation = require('../models/propertyBuyerRelation.model');
const Axios = require('axios');
const AWS = require('aws-sdk');

const createBuyerSeller = async (body, otp) => {
  const { email, mobile } = body;
  let values = { ...body, ...{ created: moment(), date: moment().format('YYYY-MM-DD'), plane: 2 } };
  let values1 = { Otp: otp, email: email, mobile: mobile };
  const buyerSeller = await BuyerSeller.create(values);
  await BuyerSellerOTP.create(values1);
  return buyerSeller;
};

const BuyerReshedule = async (body, id) => {
  const { postId, status } = body;
  let postFind = await SellerPost.findById(postId);
  if (!postFind) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Post Not Found');
  }
  let sellerId = postFind.userId;
  // let status = 'Re-Schedule';
  let data = { postId: postId, buyerId: id, sellerId: sellerId, type: status };
  let creation = await SellerNotification.create(data);
  let sheduledRelation = await PropertyBuyerRelation.findOne({ userId: id, propertyId: postId, status: 'Shcedule' });
  sheduledRelation = await PropertyBuyerRelation.findByIdAndUpdate(
    { _id: sheduledRelation._id },
    { status: status },
    { new: true }
  );
  return sheduledRelation;
};

const createBuyer = async (body, otp) => {
  const { email, mobile } = body;
  let values = {
    ...body,
    ...{ created: moment(), date: moment().format('YYYY-MM-DD'), plane: 2, videos: 5, Image: 5, contactView: 2 },
  };
  let values1 = { Otp: otp, email: email, mobile: mobile };
  const buyerSeller = await Buyer.create(values);
  await BuyerSellerOTP.create(values1);
  return buyerSeller;
};

// Login With Mail

const LoginWithmail = async (body, otp) => {
  let values = { ...body, ...{ Otp: otp, created: moment() } };
  let OTP = await BuyerSellerOTP.create(values);
  return OTP;
};

// Login With Mail For Buyer

const LoginWithmailBuyer = async (body, otp) => {
  let values = { ...body, ...{ Otp: otp, created: moment() } };
  let OTP = await BuyerSellerOTP.create(values);
  return { active: OTP.active, email: OTP.email, created: OTP.created, _id: OTP._id };
};

const verifyOtp = async (body) => {
  const { email, otp } = body;
  let check = await BuyerSeller.findOne({ email: email });
  if (!check) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mobile Number Not Registered');
  }
  let otpCheck = await BuyerSellerOTP.findOne({ email: email, Otp: otp, active: true }).sort({ created: -1 });
  if (!otpCheck) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP');
  }
  check = await BuyerSeller.findByIdAndUpdate({ _id: check._id }, { verified: true }, { new: true });
  otpCheck = await BuyerSellerOTP.findByIdAndUpdate({ _id: otpCheck._id }, { active: false }, { new: true });
  return check;
};

const verifyOtpBuyer = async (body) => {
  const { email, otp } = body;
  let check = await Buyer.findOne({ email: email });
  if (!check) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mobile Number Not Registered');
  }
  let otpCheck = await BuyerSellerOTP.findOne({ email: email, Otp: otp, active: true }).sort({ created: -1 });
  if (!otpCheck) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP');
  }
  check = await Buyer.findByIdAndUpdate({ _id: check._id }, { verified: true, active: true }, { new: true });
  otpCheck = await BuyerSellerOTP.findByIdAndUpdate({ _id: otpCheck._id }, { active: false }, { new: true });
  return check;
};

// create seller Post

const createSellerPost = async (body, userId) => {
  let expiredDate = moment().toDate();
  let postValidate = moment().add(body.validity, 'minutes').toDate();
  let Sellers = await Buyer.findById(userId);
  // let planedata;
  // const { finishSubmit } = body;
  // if (finishSubmit == true) {
  //   if (Sellers.plane <= 0) {
  //     let userplanes = await userPlane
  //       .findOne({
  //         userId: userId,
  //         planValidate: { $gt: expiredDate },
  //         PlanRole: 'Seller',
  //         PostNumber: { $gt: 0 },
  //       })
  //       .sort({ created: -1 });

  //     if (!userplanes) {
  //       throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Exceeded');
  //     }
  //     planedata = {
  //       planId: userplanes._id,
  //       imageUpload: userplanes.Image,
  //       videoUpload: userplanes.Videos,
  //     };
  //     console.log(planedata);
  //     let existplane = parseInt(userplanes.PostNumber);
  //     let totals = existplane - 1;
  //     userplanes = await userPlane.findByIdAndUpdate({ _id: userplanes._id }, { PostNumber: totals }, { new: true });
  //   } else {
  //     let plancount = parseInt(Sellers.plane);
  //     let total = plancount - 1;
  //     await Buyer.findByIdAndUpdate({ _id: userId }, { plane: total }, { new: true });
  //     planedata = { videoUpload: Sellers.videos, imageUpload: Sellers.Image };
  //   }
  // }
  let values = {
    ...body,
    ...{
      created: moment(),
      date: moment().format('YYYY-MM-DD'),
      userId: userId,
      propertyExpiredDate: postValidate,
    },
  };
  const sellerPost = await SellerPost.create(values);
  return sellerPost;
};

// create BuyerRentiee

const createBuyerRentiee = async (body, userId) => {
  const { Type } = body;
  let sellerType;
  if (Type === 'rentiee') {
    sellerType = 'rent';
  }
  if (Type === 'Buyer') {
    sellerType = 'sell';
  }
  let values = {
    ...body,
    ...{ created: moment(), date: moment().format('YYYY-MM-DD'), userId: userId, sellerType: sellerType },
  };
  let BR = await BuyerRentie.create(values);
  return BR;
};

// search House Or Flat for BuyerRentie

const SearchHouseFlatByBuyer_Or_Rentiee = async (id) => {
  let area = { active: true };

  // let values = await SellerPost.find();
  // values.forEach((e) => {
  //   if (e.lat != null && e.long != null) {
  //     e.locationCoordinates = { type: 'Point', coordinates: [e.lat, e.long] };
  //     e.save()
  //   }
  // });
  return { message: 'sdfasdf' };
};

const DisplayAvailable_HouseOr_Flat = async (query) => {
  console.log(query);
  let location = { active: true };
  let loc = query.location;
  if (loc != null && loc != '') {
    location = { location: { $eq: loc } };
  }
  let values = await SellerPost.aggregate([
    { $match: { pineCode: { $ne: null } } },
    {
      $match: { $and: [location] },
    },
  ]);
  return values;
};

const AutoMatches_ForBuyer_rentiee = async (userId) => {
  console.log(userId);
  let data = await BuyerRentie.findOne({ userId: userId });
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buyer Post Not Found');
  }
  console.log(data);
  let Type;
  let HouseOrCommercialType;
  if (data.Type == 'rentiee') {
    Type = 'rent';
  }
  if (data.Type == 'buyer') {
    Type = 'rent';
  }
  if (data.HouseOrCommercialType === 'residential') {
    HouseOrCommercialType = 'residential';
  }
  if (data.HouseOrCommercialType === 'commercial') {
    HouseOrCommercialType = 'commercial';
  }

  let values = await SellerPost.aggregate([
    {
      $match: {
        Type: Type,
        HouseOrCommercialType: HouseOrCommercialType,
        MonthlyRentFrom: { $lte: data.ToPrice },
        city: data.PrefferedCities,
      },
    },
  ]);
  return values;
};

// create Admin Register

const createAdmin = async (body) => {
  let values = { ...body, ...{ created: moment() } };
  const values1 = await Admin.findOne({ mobileNumber: body.mobileNumber });
  if (values1) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Already Registered');
  }
  const create = await Admin.create(values);
  return create;
};

const AdminLogin = async (body) => {
  let { mobileNumber } = body;
  let values = await Admin.findOne({ mobileNumber: mobileNumber });
  if (!values) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not Registered');
  }
  return values;
};

const getSellerRenter_POST_ForAdmin = async (query) => {
  const { activeStatus, page, range, propType, Type, area } = query;

  let activeStatusMatch = { finsh: { $eq: true } };
  let protypeMatch = { finsh: { $eq: true } };
  let typeMatch = { finsh: { $eq: true } };
  let areaMatch = { finsh: { $eq: true } };
  if (activeStatus) {
    let status;
    if (activeStatus == 'true') {
      status = true;
    } else {
      status = false;
    }
    activeStatusMatch = { active: status };
  } else {
    activeStatusMatch;
  }
  if (propType) {
    protypeMatch = { HouseOrCommercialType: { $regex: propType, $options: 'i' } };
  } else {
    protypeMatch;
  }
  // Type
  // typeMatch
  if (Type) {
    typeMatch = { Type: { $regex: Type, $options: 'i' } };
  } else {
    typeMatch;
  }

  //areaMatch
  if (area) {
    areaMatch = { area: { $regex: area, $options: 'i' } };
  } else {
    areaMatch;
  }

  const data = await SellerPost.aggregate([
    {
      $match: { $and: [activeStatusMatch, protypeMatch, typeMatch, areaMatch, { finsh: true }] },
    },
    {
      $skip: parseInt(range) * parseInt(page),
    },
    {
      $limit: parseInt(range),
    },
  ]);
  const total = await SellerPost.aggregate([
    {
      $match: { $and: [activeStatusMatch, protypeMatch, typeMatch, areaMatch, { finsh: true }] },
    },
  ]);
  return { values: data, total: total.length };
};
const ApproveAndReject = async (id, body) => {
  let values = await SellerPost.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post Not Found');
  }
  values = await SellerPost.findByIdAndUpdate({ _id: id }, body, { new: true });
  return values;
};

const getLocationByAddress = async (text) => {
  let values = await Axios.get(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${text}&inputtype=textquery&fields=geometry&key=AIzaSyD8NFC9JWmp2ofQFhglFmovCa-pzPUn-gE`
  );
  if (values.data) {
    let location = values.data.candidates[0].geometry.location;
    return location;
  }
};

const getApprover_Property = async (query, userId, body) => {
  console.log(query);
  // let locationss = await getLocationByAddress('Anna Nagar, Chennai, Tamil Nadu, India');
  // console.log(locationss);
  let cityMatch = { active: true };
  let propertMatch = { active: true };
  let BHKTypeMatch = { active: true };
  let MonthlyRentFromMatch = { active: true };
  let MonthlyRentToMatch = { active: true };
  let HouseOrCommercialTypeMatch = { active: true };
  let typeMatch = { active: true };
  let formatAdd = { active: true };
  let rentMatch = { active: true };
  let furnishingMatch = { active: true };
  let parkingMatch = { active: true };
  let bathroomMatch = { active: true };
  let rentPreferMatch = { active: true };
  let propAgeMatch = { active: true };
  let BuildupSizeMatch = { active: true };
  let priceMatch = { active: true };
  let floorMatch = { active: true };
  let buildingTypeMatch = { active: true };
  let amaenitiesMatch = { active: true };
  let buildingAgeMatch = { active: true };
  let page = parseInt(query.page);
  let range = parseInt(query.range);
  let area = query.area;
  // area filter
  if (area) {
    if ((area != 'null') | (area != '')) {
      cityMatch = { city: { $regex: query.area, $options: 'i' } };
    } else {
      cityMatch;
    }
  } else {
    cityMatch;
  }

  // HouseOrCommercialType Filter

  if (query.HouseOrCommercialType) {
    if (query.HouseOrCommercialType != 'null') {
      HouseOrCommercialTypeMatch = { HouseOrCommercialType: query.HouseOrCommercialType };
    } else {
      HouseOrCommercialTypeMatch;
    }
  } else {
    HouseOrCommercialTypeMatch;
  }

  // Type Filters

  if (query.type) {
    if (query.type != 'null') {
      typeMatch = { Type: query.type };
    } else {
      typeMatch;
    }
  } else {
    typeMatch;
  }

  // formatAdd Filter
  let today = moment().toDate();
  if (query.formatAdd) {
    if (query.formatAdd != '') {
      let formatAddrs = [];
      query.formatAdd.split(',').forEach((e) => {
        formatAddrs.push({ formatedAddress: { $regex: e, $options: 'i' } });
      });
      formatAdd = { $and: formatAddrs };
    }
  }

  // BHK Filter

  if (query.BHKType) {
    let arr = [];
    query.BHKType.split(',').forEach((e) => {
      let num = parseInt(e);
      if (num == 4) {
        arr.push({ BhkCount: { $gte: num } });
      } else {
        arr.push({ BhkCount: { $eq: num } });
      }
    });
    BHKTypeMatch = { $or: arr };
  }

  if (query.propertType) {
    let arr = [];
    query.propertType.split(',').forEach((e) => {
      arr.push(e);
    });
    propertMatch = { $or: [{ propertType: { $in: arr } }] };
  } else {
    propertMatch;
  }

  // rentDetails Filter

  if (query.rentDetails) {
    let arr = [];
    query.rentDetails.split(',').forEach((e) => {
      arr.push(e);
    });
    rentMatch = { $or: [{ rentDetails: { $in: arr } }] };
  } else {
    rentMatch;
  }

  // furnishing Filter

  if (query.furnishing) {
    let arr = [];
    query.furnishing.split(',').forEach((e) => {
      arr.push(e);
    });
    furnishingMatch = { $or: [{ furnishingStatus: { $in: arr } }] };
  } else {
    furnishingMatch;
  }

  //parking Filter

  if (query.parking) {
    let arr = [];
    query.parking.split(',').forEach((e) => {
      arr.push(e);
    });
    parkingMatch = { $or: [{ parkingFacilities: { $in: arr } }] };
  } else {
    parkingMatch;
  }

  // Bath Room Filter

  if (query.bathroom) {
    let arr = [];
    let num = 0;
    query.bathroom.split(',').forEach((e) => {
      let numb = parseInt(e);
      console.log(numb);
      if (numb < 4) {
        arr.push(numb);
      }
      if (numb == 4) {
        num = 4;
      }
    });
    bathroomMatch = { $or: [{ BathCount: { $in: arr } }] };
    if (num == 4) {
      bathroomMatch = { $or: [{ BathCount: { $gte: num } }] };
    }
  } else {
    bathroomMatch;
  }

  // rentprefer Filter

  if (query.rentprefer) {
    let arr = [];
    query.rentprefer.split(',').forEach((e) => {
      arr.push(e);
    });
    rentPreferMatch = { $or: [{ RentPrefer: { $in: arr } }] };
  } else {
    rentPreferMatch;
  }

  // property Age

  if (query.propAge) {
    let arr = [];
    query.propAge.split(',').forEach((e) => {
      arr.push(e);
    });
    propAgeMatch = { $or: [{ ageOfBuilding: { $in: arr } }] };
  } else {
    propAgeMatch;
  }

  // Build Up Area Filter

  if (query.buildupfrom && query.buildupto) {
    let from = parseInt(query.buildupfrom);
    let to = parseInt(query.buildupto);
    BuildupSizeMatch = { $or: [{ BuildedSize: { $gte: from, $lte: to } }] };
  } else {
    BuildupSizeMatch;
  }

  // Price Filter

  if (query.priceFrom && query.priceTo) {
    let from = parseInt(query.priceFrom);
    let to = parseInt(query.priceTo);
    priceMatch = { $or: [{ MonthlyRentFrom: { $gte: from, $lte: to } }] };
  } else {
    priceMatch;
  }

  if (query.buildingType) {
    // buildingTypeMatch
    buildingTypeMatch = { buildingType: { $regex: query.buildingType, $options: 'i' } };
  } else {
    buildingTypeMatch;
  }

  // amaenitiesMatch
  if (query.amenities) {
    let arr = [];
    let data = query.amenities.split(',');
    data.forEach((e) => {
      if (e === 'lift') {
        arr.push({ Lift: { $ne: 'No' }, HouseOrCommercialType: { $eq: 'Commercial' } });
      }
      if (e == 'power backup') {
        arr.push({ powerBackup: { $ne: 'Need to Arrange' }, HouseOrCommercialType: { $eq: 'Commercial' } });
      }
    });
    amaenitiesMatch = { $or: arr };
  }

  //buildingAgeMatch
  if (query.ageOfBuilding) {
    if (query.ageOfBuilding == 'Under Construction') {
      buildingAgeMatch = { ageOfBuilding: { $eq: query.ageOfBuilding } };
    } else {
      buildingAgeMatch = { ageOfBuilding: { $ne: 'Under Construction' } };
    }
  }

  let finish;
  if (query.finish == 'true' || query.finish == true) {
    finish = true;
  } else {
    finish = false;
  }

  if (query.floor) {
    let arr = [];
    let value = query.floor.split(',');
    value.forEach((e) => {
      let apli = e.split('-');
      if (apli.length == 1) {
        let oneValue = parseInt(apli[0]);
        arr.push({ floorCount: { $eq: oneValue } });
      } else {
        let from = parseInt(apli[0]);
        let to = parseInt(apli[1]);
        arr.push({ floorCount: { $gte: from, $lte: to } });
        console.log(from, to);
      }
    });
    floorMatch = { $or: arr };
  }

  let values = await SellerPost.aggregate([
    {
      // $match: {
      //   $and: [
      //     cityMatch,
      //     propertMatch,
      //     BHKTypeMatch,
      //     MonthlyRentFromMatch,
      //     MonthlyRentToMatch,
      //     HouseOrCommercialTypeMatch,
      //     typeMatch,
      //     formatAdd,
      //     rentMatch,
      //     furnishingMatch,
      //     parkingMatch,
      //     bathroomMatch,
      //     rentPreferMatch,
      //     propAgeMatch,
      //     BuildupSizeMatch,
      //     priceMatch,
      //     floorMatch,
      //     buildingTypeMatch,
      //     amaenitiesMatch,
      //     buildingAgeMatch,
      //     // { propStatus: 'Approved' },
      //     {
      //       finsh: finish,
      //     },
      //   ],
      // },

      // Try

      $facet: {
        andMatchedData: [
          {
            $match: {
              $and: [
                cityMatch,
                propertMatch,
                BHKTypeMatch,
                MonthlyRentFromMatch,
                MonthlyRentToMatch,
                HouseOrCommercialTypeMatch,
                typeMatch,
                formatAdd,
                rentMatch,
                furnishingMatch,
                parkingMatch,
                bathroomMatch,
                rentPreferMatch,
                propAgeMatch,
                BuildupSizeMatch,
                priceMatch,
                floorMatch,
                buildingTypeMatch,
                amaenitiesMatch,
                buildingAgeMatch,
                // { propStatus: 'Approved' },
                {
                  finsh: finish,
                },
              ],
            },
          },
        ],

        orMatchedData: [
          {
            $match: {
              $and: [formatAdd, typeMatch, HouseOrCommercialTypeMatch],
            },
          },
          {
            $sort: {
              MonthlyRentFrom: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        result: { $concatArrays: ['$andMatchedData', '$orMatchedData'] },
      },
    },
    {
      $unwind: '$result',
    },
    {
      $sort: { created: -1 },
    },
    {
      $replaceRoot: { newRoot: '$result' },
    },
    {
      $lookup: {
        from: 'properbuyerrelations',
        localField: '_id',
        foreignField: 'propertyId',
        pipeline: [{ $match: { userId: userId } }, { $sort: { created: -1 } }, { $limit: 1 }],
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
        AdditionalDetails: 1,
        image: 1,
        active: 1,
        propertyExpired: 1,
        propStatus: 1,
        HouseOrCommercialType: 1,
        propertType: 1,
        ageOfBuilding: 1,
        BHKType: 1,
        furnishingStatus: 1,
        bathRoomCount: 1,
        landSize: 1,
        noOfFloor: 1,
        IntrestedStatus: {
          $ifNull: [{ $map: { input: '$intrestedUsers', as: 'value', in: { $eq: ['$$value', userId] } } }, []],
        },
        whistListStatus: { $ifNull: [{ $map: { input: '$WhishList', as: 'value', in: { $eq: ['$$value', userId] } } }, []] },
        videos: 1,
        floorNo: 1,
        IfCommercial: 1,
        Type: 1,
        BuildingName: 1,
        BuildedSize: 1,
        buildingDirection: 1,
        discription: 1,
        availability: 1,
        RentPrefer: 1,
        Address: 1,
        pineCode: 1,
        city: 1,
        locality: 1,
        parkingFacilities: 1,
        bathRoomType: 1,
        balconyCount: 1,
        roomType: 1,
        floorType: 1,
        MonthlyRentFrom: 1,
        MonthlyRentTo: 1,
        depositeAmount: 1,
        periodOfRentFrom: 1,
        periodOfRentTo: 1,
        created: 1,
        date: 1,
        userId: 1,
        propertyExpiredDate: 1,
        final: 1,
        expiredDate: 1,
        intrestedUsers: 1,
        WhishList: 1,
        scheduleDate: '$users.scheduleDate',
        lat: 1,
        usersStatus: { $ifNull: ['$users.status', 'unViewed'] },
        userscreated: { $ifNull: ['$users.created', 'unViewed'] },
        users: '$users',
        long: 1,
        expectedPrice: 1,
        area: 1,
        city: 1,
        formatedAddress: 1,
        routeLink: 1,
        rentDetails: 1,
        buildingType: 1,
        floorCount: 1,
        status: {
          $cond: {
            if: { $gt: [today, '$propertyExpiredDate'] },
            then: 'Expired',
            else: 'Pending',
          },
        },
      },
    },
    {
      $project: {
        status: 1,
        videos: 1,
        floorNo: 1,
        IfCommercial: 1,
        Type: 1,
        BuildingName: 1,
        BuildedSize: 1,
        buildingDirection: 1,
        discription: 1,
        WhishList: 1,
        availability: 1,
        final: 1,
        RentPrefer: 1,
        Address: 1,
        pineCode: 1,
        city: 1,
        locality: 1,
        parkingFacilities: 1,
        bathRoomType: 1,
        balconyCount: 1,
        roomType: 1,
        floorType: 1,
        MonthlyRentFrom: 1,
        MonthlyRentTo: 1,
        depositeAmount: 1,
        periodOfRentFrom: 1,
        periodOfRentTo: 1,
        created: 1,
        date: 1,
        userId: 1,
        propertyExpiredDate: 1,
        expiredDate: 1,
        intrestedUsers: 1,
        _id: 1,
        AdditionalDetails: 1,
        image: 1,
        active: 1,
        propertyExpired: 1,
        propStatus: 1,
        HouseOrCommercialType: 1,
        propertType: 1,
        ageOfBuilding: 1,
        users: 1,
        BHKType: 1,
        furnishingStatus: 1,
        bathRoomCount: 1,
        landSize: 1,
        usersStatus: 1,
        noOfFloor: 1,
        whistListStatus: 1,
        scheduleDate: 1,
        userscreated: 1,
        lat: 1,
        long: 1,
        formatedAddress: 1,
        routeLink: 1,
        floorCount: 1,
        IntrestedStatus: {
          $ifNull: [{ $cond: { if: { $in: [true, '$IntrestedStatus'] }, then: true, else: false } }, false],
        },
        whistListStatus: {
          $ifNull: [{ $cond: { if: { $in: [true, '$whistListStatus'] }, then: true, else: false } }, false],
        },
        MonthlyRentFrom: 1,
        expectedPrice: 1,
        area: 1,
        city: 1,
        routLink: 1,
        rentDetails: 1,
        buildingType: 1,
      },
    },
    {
      $skip: range * page,
    },
    {
      $limit: range,
    },
  ]);
  // let nearby = await SellerPost.aggregate([
  //   {
  //     $geoNear: {
  //       // includeLocs: 'location',
  //       // key: 'locationCoordinates',
  //       near: {
  //         type: 'Point',
  //         coordinates: [80.1845234, 13.0964535],
  //       },
  //       distanceField: 'distance',
  //       spherical: true,
  //     },
  //   },
  //   {
  //     $sort: {
  //       distance: 1,
  //     },
  //   },
  // ]);
  let total = await SellerPost.aggregate([
    {
      $match: {
        $and: [
          cityMatch,
          propertMatch,
          BHKTypeMatch,
          MonthlyRentFromMatch,
          MonthlyRentToMatch,
          HouseOrCommercialTypeMatch,
          typeMatch,
          formatAdd,
          rentMatch,
          furnishingMatch,
          parkingMatch,
          bathroomMatch,
          rentPreferMatch,
          propAgeMatch,
          BuildupSizeMatch,
          priceMatch,
          floorMatch,
          buildingTypeMatch,
          // { propStatus: 'Approved' },
          {
            finsh: finish,
          },
        ],
      },
    },
    {
      $sort: { created: -1 },
    },
    {
      $project: {
        _id: 1,
        AdditionalDetails: 1,
        image: 1,
        active: 1,
        propertyExpired: 1,
        propStatus: 1,
        HouseOrCommercialType: 1,
        propertType: 1,
        ageOfBuilding: 1,
        BHKType: 1,
        furnishingStatus: 1,
        bathRoomCount: 1,
        landSize: 1,
        noOfFloor: 1,
        videos: 1,
        floorNo: 1,
        IfCommercial: 1,
        Type: 1,
        BuildingName: 1,
        BuildedSize: 1,
        buildingDirection: 1,
        discription: 1,
        availability: 1,
        RentPrefer: 1,
        Address: 1,
        pineCode: 1,
        city: 1,
        locality: 1,
        parkingFacilities: 1,
        bathRoomType: 1,
        balconyCount: 1,
        roomType: 1,
        floorType: 1,
        MonthlyRentFrom: 1,
        MonthlyRentTo: 1,
        depositeAmount: 1,
        periodOfRentFrom: 1,
        periodOfRentTo: 1,
        created: 1,
        date: 1,
        propertyExpiredDate: 1,
        expiredDate: 1,
        status: {
          $cond: {
            if: { $gt: [today, '$propertyExpiredDate'] },
            then: 'Expired',
            else: 'Pending',
          },
        },
      },
    },
    {
      $project: {
        status: 1,
        IntrestedStatus: { $cond: { if: { $eq: [true, ['$IntrestedStatus']] }, then: true, else: false } },
      },
    },
  ]);
  // const uniqueArray = values.filter((obj, index, self) =>
  //   index === self.findIndex((o) => o._id === obj._id)
  // );
  const uniqueIds = new Map();
  const uniqueArray = [];

  values.forEach((obj) => {
    if (!uniqueIds.has(obj._id)) {
      uniqueIds.set(obj._id, true);
      uniqueArray.push(obj);
    }
  });
  return {
    values: uniqueArray,
    total: total.length,
    // single: values[0],
    // nearby,
  };
};

const getApprover_Property_new = async (query, userId, body) => {
  let {
    pincode,
    priceTo,
    priceFrom,
    BHKType,
    HouseOrCommercialType,
    range,
    page,
    type,
    propertType,
    rentDetails,
    furnishing,
    parking,
    rentprefer,
    propAge,
    bathroom,
    floor,
    buildupto,
    buildupfrom,
    propStatus,
    amenities,
    formatAdd,
    index,
  } = query;
  let match_A = []; //Perfect Match
  let match_B = []; //
  let match_C = [];
  let match_D = [];
  let match_E = [];
  let match_F = [];
  let match_G = [];
  let match_H = [];
  let match_I = [];
  let match_J = [];
  let match_K = [];
  let match_L = [];
  let match_M = [];
  let match_N = [];
  let match_O = [];
  if (range == '' || range == null) {
    range = 10;
  }
  range = parseInt(range);
  if (page == '' || page == null) {
    page = 0;
  }
  page = parseInt(page);

  // { $regexMatch: { input: "$description", regex: "line", options: "i" } }

  // condition -1 A
  let nearby_location = {
    $geoNear: {
      near: { type: 'Point', coordinates: [80.2316737, 13.0391935] },
      key: 'location',
      distanceField: 'distance',
      spherical: true,
    },
  };
  if (formatAdd != null && formatAdd !== '') {
    let eq = [];
    let neq = [];
    if (Array.isArray(formatAdd)) {
      let near = await getCoordinatesByAddress(formatAdd[0]);
      if (near != null) {
        if (near.results.length != 0) {
          let lat = near.results[0].geometry.location.lat;
          let lng = near.results[0].geometry.location.lng;
          nearby_location = {
            $geoNear: {
              near: { type: 'Point', coordinates: [lng, lat] },
              key: 'location',
              distanceField: 'distance',
              spherical: true,
            },
          };
        }
      }
      formatAdd.forEach(async (e) => {
        // console.log(near)
        if (near != null) {
          console.log(near.geometry);
        }
        let localmatch = [];
        let format = e.split(',');
        format.forEach((a) => {
          localmatch.push({ $regexMatch: { input: '$formatedAddress', regex: a, options: 'i' } });
        });
        eq.push({ $and: localmatch });
      });
    } else {
      let localmatch = [];
      let format = formatAdd.split(',');
      let near = await getCoordinatesByAddress(formatAdd);
      if (near != null) {
        if (near.results.length != 0) {
          let lat = near.results[0].geometry.location.lat;
          let lng = near.results[0].geometry.location.lng;
          nearby_location = {
            $geoNear: {
              near: { type: 'Point', coordinates: [lng, lat] },
              key: 'location',
              distanceField: 'distance',
              spherical: true,
            },
          };
        }
      }
      format.forEach((a) => {
        localmatch.push({ $regexMatch: { input: '$formatedAddress', regex: a, options: 'i' } });
      });
      eq.push({ $and: localmatch });
    }
    match_A.push({ $or: eq });
    match_B.push({ $or: eq });
    match_C.push({ $or: eq });
    match_D.push({ $or: eq });
    match_E.push({ $or: eq });
    match_F.push({ $or: eq });
    match_G.push({ $or: eq });
    match_H.push({ $or: eq });
    match_I.push({ $or: eq });
    match_J.push({ $or: eq });
    match_K.push({ $or: eq });
    match_L.push({ $or: eq });
    match_M.push({ $or: eq });
    match_N.push({ $or: eq });
    match_O.push({ $or: eq });
  }

  // condition -1 A
  // if (pincode != null && pincode !== '') {
  //   pincode = pincode.split(',');
  //   let eq = [];
  //   let neq = [];
  //   pincode.forEach((e) => {
  //     eq.push({ $eq: ['$pineCode', parseInt(e)] });
  //   });
  //   match_A.push({ $or: eq });
  //   match_B.push({ $or: eq });
  //   match_C.push({ $or: eq });
  //   match_D.push({ $or: eq });
  //   match_E.push({ $or: eq });
  //   match_F.push({ $or: eq });
  //   match_G.push({ $or: eq });
  //   match_H.push({ $or: eq });
  //   match_I.push({ $or: eq });
  //   match_J.push({ $or: eq });
  //   match_K.push({ $or: eq });
  //   match_L.push({ $or: eq });
  //   match_M.push({ $or: eq });
  //   match_N.push({ $or: eq });
  // }
  // condition -2 B
  if (BHKType != null && BHKType !== '') {
    BHKType = BHKType.split(',');
    console.log(BHKType);
    let eq = [];
    let neq = [];
    BHKType.forEach((e) => {
      // eq.push({ $eq: ['$BHKType', e] });
      if (parseInt(e) != 4) {
        eq.push({ $eq: ['$BhkCount', parseInt(e)] });
      } else {
        eq.push({ $gte: ['$BhkCount', 4] });
      }
    });
    neq.push({ $gte: ['$BHKType', 0] });
    match_A.push({ $or: eq });
    match_B.push({ $or: neq });
    match_C.push({ $or: eq });
    match_D.push({ $or: eq });
    match_E.push({ $or: eq });
    match_F.push({ $or: eq });
    match_G.push({ $or: eq });
    match_H.push({ $or: eq });
    match_I.push({ $or: eq });
    match_J.push({ $or: eq });
    match_K.push({ $or: eq });
    match_L.push({ $or: eq });
    match_M.push({ $or: eq });
    match_N.push({ $or: eq });
  }
  // condition -3 C
  if (priceTo != null && priceTo !== '' && priceFrom != null && priceFrom !== '') {
    match_A.push({ $gte: ['$MonthlyRentFrom', parseInt(priceFrom)] });
    match_A.push({ $lte: ['$MonthlyRentFrom', parseInt(priceTo)] });

    match_B.push({ $gte: ['$MonthlyRentFrom', parseInt(priceFrom)] });
    match_B.push({ $lte: ['$MonthlyRentFrom', parseInt(priceTo)] });

    match_C.push({ $gte: ['$MonthlyRentFrom', 0] });

    match_D.push({ $gte: ['$MonthlyRentFrom', parseInt(priceFrom)] });
    match_D.push({ $lte: ['$MonthlyRentFrom', parseInt(priceTo)] });

    match_E.push({ $gte: ['$MonthlyRentFrom', parseInt(priceFrom)] });
    match_E.push({ $lte: ['$MonthlyRentFrom', parseInt(priceTo)] });

    match_F.push({ $gte: ['$MonthlyRentFrom', parseInt(priceFrom)] });
    match_F.push({ $lte: ['$MonthlyRentFrom', parseInt(priceTo)] });

    match_G.push({ $gte: ['$MonthlyRentFrom', parseInt(priceFrom)] });
    match_G.push({ $lte: ['$MonthlyRentFrom', parseInt(priceTo)] });

    match_H.push({ $gte: ['$MonthlyRentFrom', parseInt(priceFrom)] });
    match_H.push({ $lte: ['$MonthlyRentFrom', parseInt(priceTo)] });

    match_I.push({ $gte: ['$MonthlyRentFrom', parseInt(priceFrom)] });
    match_I.push({ $lte: ['$MonthlyRentFrom', parseInt(priceTo)] });

    match_J.push({ $gte: ['$MonthlyRentFrom', parseInt(priceFrom)] });
    match_J.push({ $lte: ['$MonthlyRentFrom', parseInt(priceTo)] });

    match_K.push({ $gte: ['$MonthlyRentFrom', parseInt(priceFrom)] });
    match_K.push({ $lte: ['$MonthlyRentFrom', parseInt(priceTo)] });

    match_L.push({ $gte: ['$MonthlyRentFrom', parseInt(priceFrom)] });
    match_L.push({ $lte: ['$MonthlyRentFrom', parseInt(priceTo)] });

    match_M.push({ $gte: ['$MonthlyRentFrom', parseInt(priceFrom)] });
    match_M.push({ $lte: ['$MonthlyRentFrom', parseInt(priceTo)] });

    match_N.push({ $gte: ['$MonthlyRentFrom', parseInt(priceFrom)] });
    match_N.push({ $lte: ['$MonthlyRentFrom', parseInt(priceTo)] });
  }
  // condition -4
  if (HouseOrCommercialType != null && HouseOrCommercialType !== '') {
    match_A.push({ $eq: ['$HouseOrCommercialType', HouseOrCommercialType] });
    match_B.push({ $eq: ['$HouseOrCommercialType', HouseOrCommercialType] });
    match_C.push({ $eq: ['$HouseOrCommercialType', HouseOrCommercialType] });
    match_D.push({ $eq: ['$HouseOrCommercialType', HouseOrCommercialType] });
    match_E.push({ $eq: ['$HouseOrCommercialType', HouseOrCommercialType] });
    match_F.push({ $eq: ['$HouseOrCommercialType', HouseOrCommercialType] });
    match_G.push({ $eq: ['$HouseOrCommercialType', HouseOrCommercialType] });
    match_H.push({ $eq: ['$HouseOrCommercialType', HouseOrCommercialType] });
    match_I.push({ $eq: ['$HouseOrCommercialType', HouseOrCommercialType] });
    match_J.push({ $eq: ['$HouseOrCommercialType', HouseOrCommercialType] });
    match_K.push({ $eq: ['$HouseOrCommercialType', HouseOrCommercialType] });
    match_L.push({ $eq: ['$HouseOrCommercialType', HouseOrCommercialType] });
    match_M.push({ $eq: ['$HouseOrCommercialType', HouseOrCommercialType] });
    match_N.push({ $eq: ['$HouseOrCommercialType', HouseOrCommercialType] });
    match_O.push({ $eq: ['$HouseOrCommercialType', HouseOrCommercialType] });
  }
  // condition -5
  if (type != null && type !== '') {
    match_A.push({ $eq: ['$Type', type] });
    match_B.push({ $eq: ['$Type', type] });
    match_C.push({ $eq: ['$Type', type] });
    match_D.push({ $eq: ['$Type', type] });
    match_E.push({ $eq: ['$Type', type] });
    match_F.push({ $eq: ['$Type', type] });
    match_G.push({ $eq: ['$Type', type] });
    match_H.push({ $eq: ['$Type', type] });
    match_I.push({ $eq: ['$Type', type] });
    match_J.push({ $eq: ['$Type', type] });
    match_K.push({ $eq: ['$Type', type] });
    match_L.push({ $eq: ['$Type', type] });
    match_M.push({ $eq: ['$Type', type] });
    match_N.push({ $eq: ['$Type', type] });
    match_O.push({ $eq: ['$Type', type] });
  }
  // condition -6 D
  if (propertType != null && propertType !== '' && propertType != null && propertType !== '') {
    propertType = propertType.split(',');
    let eq = [];
    let neq = [];
    propertType.forEach((e) => {
      eq.push({ $eq: ['$propertType', e] });
      neq.push({ $ne: ['$rentDetails', e] });
    });
    match_A.push({ $or: eq });
    match_B.push({ $or: eq });
    match_C.push({ $or: eq });
    match_D.push({ $or: neq });
    match_E.push({ $or: eq });
    match_F.push({ $or: eq });
    match_G.push({ $or: eq });
    match_H.push({ $or: eq });
    match_I.push({ $or: eq });
    match_J.push({ $or: eq });
    match_K.push({ $or: eq });
    match_L.push({ $or: eq });
    match_M.push({ $or: eq });
    match_N.push({ $or: eq });
  }
  // condition -7 E
  if (rentDetails != null && rentDetails !== '') {
    rentDetails = rentDetails.split(',');
    let eq = [];
    let neq = [];
    rentDetails.forEach((e) => {
      eq.push({ $eq: ['$rentDetails', e] });
      neq.push({ $ne: ['$rentDetails', e] });
    });
    match_A.push({ $or: eq });
    match_B.push({ $or: eq });
    match_C.push({ $or: eq });
    match_D.push({ $or: eq });
    match_E.push({ $or: neq });
    match_F.push({ $or: eq });
    match_G.push({ $or: eq });
    match_H.push({ $or: eq });
    match_I.push({ $or: eq });
    match_J.push({ $or: eq });
    match_K.push({ $or: eq });
    match_L.push({ $or: eq });
    match_M.push({ $or: eq });
    match_N.push({ $or: eq });
  }
  // condition -8 F
  if (furnishing != null && furnishing !== '') {
    furnishing = furnishing.split(',');
    let eq = [];
    let neq = [];
    furnishing.forEach((e) => {
      eq.push({ $eq: ['$furnishingStatus', e] });
      neq.push({ $ne: ['$furnishingStatus', e] });
    });
    match_A.push({ $or: eq });
    match_B.push({ $or: eq });
    match_C.push({ $or: eq });
    match_D.push({ $or: eq });
    match_E.push({ $or: eq });
    match_F.push({ $or: neq });
    match_G.push({ $or: eq });
    match_H.push({ $or: eq });
    match_I.push({ $or: eq });
    match_J.push({ $or: eq });
    match_K.push({ $or: eq });
    match_L.push({ $or: eq });
    match_M.push({ $or: eq });
    match_N.push({ $or: eq });
  }
  // condition -9 G
  if (parking != null && parking !== '') {
    parking = parking.split(',');
    let eq = [];
    let neq = [];
    parking.forEach((e) => {
      eq.push({ $eq: ['$parkingFacilities', e] });
      neq.push({ $ne: ['$parkingFacilities', e] });
    });
    match_A.push({ $or: eq });
    match_B.push({ $or: eq });
    match_C.push({ $or: eq });
    match_D.push({ $or: eq });
    match_E.push({ $or: eq });
    match_F.push({ $or: eq });
    match_G.push({ $or: neq });
    match_H.push({ $or: eq });
    match_I.push({ $or: eq });
    match_J.push({ $or: eq });
    match_K.push({ $or: eq });
    match_L.push({ $or: eq });
    match_M.push({ $or: eq });
    match_N.push({ $or: eq });
  }
  // condition -10 H
  if (rentprefer != null && rentprefer !== '') {
    rentprefer = rentprefer.split(',');
    let eq = [];
    let neq = [];
    rentprefer.forEach((e) => {
      eq.push({ $eq: ['$RentPrefer', e] });
      neq.push({ $ne: ['$RentPrefer', e] });
    });
    match_A.push({ $or: eq });
    match_B.push({ $or: eq });
    match_C.push({ $or: eq });
    match_D.push({ $or: eq });
    match_E.push({ $or: eq });
    match_F.push({ $or: eq });
    match_G.push({ $or: eq });
    match_H.push({ $or: neq });
    match_I.push({ $or: eq });
    match_J.push({ $or: eq });
    match_K.push({ $or: eq });
    match_L.push({ $or: eq });
    match_M.push({ $or: eq });
    match_N.push({ $or: eq });
  }
  // condition -11 I
  if (propAge != null && propAge !== '') {
    propAge = propAge.split(',');
    let eq = [];
    let neq = [];
    propAge.forEach((e) => {
      eq.push({ $eq: ['$ageOfBuilding', e] });
      neq.push({ $ne: ['$ageOfBuilding', e] });
    });
    match_A.push({ $or: eq });
    match_B.push({ $or: eq });
    match_C.push({ $or: eq });
    match_D.push({ $or: eq });
    match_E.push({ $or: eq });
    match_F.push({ $or: eq });
    match_G.push({ $or: eq });
    match_H.push({ $or: eq });
    match_I.push({ $or: neq });
    match_J.push({ $or: eq });
    match_K.push({ $or: eq });
    match_L.push({ $or: eq });
    match_M.push({ $or: eq });
    match_N.push({ $or: eq });
  }
  // condition -12 J
  if (bathroom != null && bathroom !== '') {
    bathroom = bathroom.split(',');
    let eq = [];
    let neq = [];
    bathroom.forEach((e) => {
      eq.push({ $eq: ['$BathCount', parseInt(e)] });
      neq.push({ $ne: ['$BathCount', parseInt(e)] });
    });
    match_A.push({ $or: eq });
    match_B.push({ $or: eq });
    match_C.push({ $or: eq });
    match_D.push({ $or: eq });
    match_E.push({ $or: eq });
    match_F.push({ $or: eq });
    match_G.push({ $or: eq });
    match_H.push({ $or: eq });
    match_I.push({ $or: eq });
    match_J.push({ $or: neq });
    match_K.push({ $or: eq });
    match_L.push({ $or: eq });
    match_M.push({ $or: eq });
    match_N.push({ $or: eq });
  }
  // condition -13 K
  if (floor != null && floor !== '') {
    let eq = [];
    let neq = [];
    let value = floor.split(',');
    value.forEach((e) => {
      let apli = e.split('-');
      if (apli.length == 1) {
        let oneValue = parseInt(apli[0]);
        if (oneValue != 13) {
          eq.push({ $eq: ['$floorCount', oneValue] });
        } else {
          eq.push({ $gte: ['$floorCount', oneValue] });
        }
      } else {
        let from = parseInt(apli[0]);
        let to = parseInt(apli[1]);
        eq.push({
          $and: [{ $gte: ['$floorCount', parseInt(from)] }, { $lte: ['$floorCount', parseInt(to)] }],
        });
      }
    });
    neq.push({ $lte: ['$floorCount', 0] });
    match_A.push({ $or: eq });
    match_B.push({ $or: eq });
    match_C.push({ $or: eq });
    match_D.push({ $or: eq });
    match_E.push({ $or: eq });
    match_F.push({ $or: eq });
    match_G.push({ $or: eq });
    match_H.push({ $or: eq });
    match_I.push({ $or: eq });
    match_J.push({ $or: eq });
    match_K.push({ $or: neq });
    match_L.push({ $or: eq });
    match_M.push({ $or: eq });
    match_N.push({ $or: eq });
  }
  // condition -14 L
  if (buildupto != null && buildupto !== '' && buildupfrom != null && buildupfrom !== '') {
    match_A.push({ $gte: ['$BuildedSize', parseInt(buildupfrom)] });
    match_A.push({ $lte: ['$BuildedSize', parseInt(buildupto)] });

    match_B.push({ $gte: ['$BuildedSize', parseInt(buildupfrom)] });
    match_B.push({ $lte: ['$BuildedSize', parseInt(buildupto)] });

    match_C.push({ $gte: ['$BuildedSize', parseInt(buildupfrom)] });
    match_C.push({ $lte: ['$BuildedSize', parseInt(buildupto)] });

    match_D.push({ $gte: ['$BuildedSize', parseInt(buildupfrom)] });
    match_D.push({ $lte: ['$BuildedSize', parseInt(buildupto)] });

    match_E.push({ $gte: ['$BuildedSize', parseInt(buildupfrom)] });
    match_E.push({ $lte: ['$BuildedSize', parseInt(buildupto)] });

    match_F.push({ $gte: ['$BuildedSize', parseInt(buildupfrom)] });
    match_F.push({ $lte: ['$BuildedSize', parseInt(buildupto)] });

    match_G.push({ $gte: ['$BuildedSize', parseInt(buildupfrom)] });
    match_G.push({ $lte: ['$BuildedSize', parseInt(buildupto)] });

    match_H.push({ $gte: ['$BuildedSize', parseInt(buildupfrom)] });
    match_H.push({ $lte: ['$BuildedSize', parseInt(buildupto)] });

    match_I.push({ $gte: ['$BuildedSize', parseInt(buildupfrom)] });
    match_I.push({ $lte: ['$BuildedSize', parseInt(buildupto)] });

    match_J.push({ $gte: ['$BuildedSize', parseInt(buildupfrom)] });
    match_J.push({ $lte: ['$BuildedSize', parseInt(buildupto)] });

    match_K.push({ $gte: ['$BuildedSize', parseInt(buildupfrom)] });
    match_K.push({ $lte: ['$BuildedSize', parseInt(buildupto)] });

    match_L.push({ $gte: ['$BuildedSize', 0] });

    match_M.push({ $gte: ['$BuildedSize', parseInt(buildupfrom)] });
    match_M.push({ $lte: ['$BuildedSize', parseInt(buildupto)] });

    match_N.push({ $gte: ['$BuildedSize', parseInt(buildupfrom)] });
    match_N.push({ $lte: ['$BuildedSize', parseInt(buildupto)] });
  }
  // condition -15 M
  if (propStatus != null && propStatus != '') {
    propStatus = propStatus.split(',');
    let eq = [];
    let neq = [];
    propStatus.forEach((e) => {
      eq.push({ $eq: ['$propStatus', e] });
      neq.push({ $ne: ['$propStatus', e] });
    });
    match_A.push({ $or: eq });
    match_B.push({ $or: eq });
    match_C.push({ $or: eq });
    match_D.push({ $or: eq });
    match_E.push({ $or: eq });
    match_F.push({ $or: eq });
    match_G.push({ $or: eq });
    match_H.push({ $or: eq });
    match_I.push({ $or: eq });
    match_J.push({ $or: eq });
    match_K.push({ $or: eq });
    match_L.push({ $or: eq });
    match_M.push({ $or: neq });
    match_N.push({ $or: eq });
  }
  // condition -16 N
  if (amenities != null && amenities != '') {
    console.log(amenities);
    amenities = amenities.split(',');
    let eq = [];
    let neq = [];
    amenities.forEach((e) => {
      eq.push({ $in: [e, '$Amenities'] });
      neq.push({ $ne: ['$Amenities', e] });
    });
    match_A.push({ $or: eq });
    match_B.push({ $or: eq });
    match_C.push({ $or: eq });
    match_D.push({ $or: eq });
    match_E.push({ $or: eq });
    match_F.push({ $or: eq });
    match_G.push({ $or: eq });
    match_H.push({ $or: eq });
    match_I.push({ $or: eq });
    match_J.push({ $or: eq });
    match_K.push({ $or: eq });
    match_L.push({ $or: eq });
    match_M.push({ $or: eq });
    match_N.push({ $or: neq });
  }
  // let matching = await SellerPost.find();
  // matching.forEach(async (e) => {
  //   console.log(e.lat);
  //   if (e.lat != null) {
  //     e.location = { type: 'Point', coordinates: [parseFloat(e.long), parseFloat(e.lat)] };
  //     e.locationCoordinates = { type: 'Point', coordinates: [parseFloat(e.long), parseFloat(e.lat)] };
  //     e.save();
  //   }
  // });
  let perfectMatch = await SellerPost.aggregate([
    nearby_location,
    { $match: { $and: [{ finsh: { $eq: true } }] } },
    {
      $lookup: {
        from: 'properbuyerrelations',
        localField: '_id',
        foreignField: 'propertyId',
        pipeline: [{ $match: { userId: userId } }, { $sort: { created: -1 } }, { $limit: 1 }],
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
      $addFields: {
        condition: {
          $cond: {
            if: { $and: match_A },
            then: 'A',
            else: {
              $cond: {
                if: { $and: match_B },
                then: 'B',
                else: {
                  $cond: {
                    if: { $and: match_C },
                    then: 'C',
                    else: {
                      $cond: {
                        if: { $and: match_D },
                        then: 'D',
                        else: {
                          $cond: {
                            if: { $and: match_E },
                            then: 'E',
                            else: {
                              $cond: {
                                if: { $and: match_F },
                                then: 'F',
                                else: {
                                  $cond: {
                                    if: { $and: match_G },
                                    then: 'G',
                                    else: {
                                      $cond: {
                                        if: { $and: match_H },
                                        then: 'H',
                                        else: {
                                          $cond: {
                                            if: { $and: match_I },
                                            then: 'I',
                                            else: {
                                              $cond: {
                                                if: { $and: match_J },
                                                then: 'J',
                                                else: {
                                                  $cond: {
                                                    if: { $and: match_K },
                                                    then: 'K',
                                                    else: {
                                                      $cond: {
                                                        if: { $and: match_L },
                                                        then: 'L',
                                                        else: {
                                                          $cond: {
                                                            if: { $and: match_M },
                                                            then: 'M',
                                                            else: {
                                                              $cond: {
                                                                if: { $and: match_N },
                                                                then: 'N',
                                                                else: {
                                                                  $cond: {
                                                                    if: { $and: match_O },
                                                                    then: 'O',
                                                                    else: {
                                                                      $cond: {
                                                                        if: {
                                                                          $and: [
                                                                            {
                                                                              $eq: [
                                                                                '$HouseOrCommercialType',
                                                                                HouseOrCommercialType,
                                                                              ],
                                                                            },
                                                                            { $eq: ['$Type', type] },
                                                                            { $lte: ['$distance', 5000] },
                                                                          ],
                                                                        },
                                                                        then: 'PA',
                                                                        else: false,
                                                                        // else: {
                                                                        //   $cond: {
                                                                        //     if: { $and: [match_B,{$lte:["$distance",5000]}] },
                                                                        //     then: 'PB',
                                                                        //     else: {
                                                                        //       $cond: {
                                                                        //         if: { $and: [match_C,{$lte:["$distance",5000]}] },
                                                                        //         then: 'PC',
                                                                        //         else: {
                                                                        //           $cond: {
                                                                        //             if: { $and: [match_D,{$lte:["$distance",5000]}] },
                                                                        //             then: 'PD',
                                                                        //             else: {
                                                                        //               $cond: {
                                                                        //                 if: { $and: [match_E,{$lte:["$distance",5000]}] },
                                                                        //                 then: 'PE',
                                                                        //                 else: {
                                                                        //                   $cond: {
                                                                        //                     if: { $and: [match_F,{$lte:["$distance",5000]}] },
                                                                        //                     then: 'PF',
                                                                        //                     else: {
                                                                        //                       $cond: {
                                                                        //                         if: { $and: [match_G,{$lte:["$distance",5000]}] },
                                                                        //                         then: 'PG',
                                                                        //                         else: {
                                                                        //                           $cond: {
                                                                        //                             if: { $and: [match_H,{$lte:["$distance",5000]}] },
                                                                        //                             then: 'PH',
                                                                        //                             else:false
                                                                        //                           },
                                                                        //                         },
                                                                        //                       },
                                                                        //                     },
                                                                        //                   },
                                                                        //                 },
                                                                        //               },
                                                                        //             },
                                                                        //           },
                                                                        //         },
                                                                        //       },
                                                                        //     },
                                                                        //   },
                                                                        // },
                                                                      },
                                                                    },
                                                                  },
                                                                },
                                                              },
                                                            },
                                                          },
                                                        },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        usersStatus: { $ifNull: ['$users.status', 'unViewed'] },
      },
    },
    {
      $match: { $and: [{ condition: { $ne: false } }] },
    },
    { $sort: { condition: 1 } },
    {
      $skip: range * page,
    },
    {
      $limit: range,
    },
  ]);

  let total = await SellerPost.aggregate([
    nearby_location,
    { $match: { $and: [{ finsh: { $eq: true } }] } },
    {
      $lookup: {
        from: 'properbuyerrelations',
        localField: '_id',
        foreignField: 'propertyId',
        pipeline: [{ $match: { userId: userId } }, { $sort: { created: -1 } }, { $limit: 1 }],
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
      $addFields: {
        condition: {
          $cond: {
            if: { $and: match_A },
            then: 'A',
            else: {
              $cond: {
                if: { $and: match_B },
                then: 'B',
                else: {
                  $cond: {
                    if: { $and: match_C },
                    then: 'C',
                    else: {
                      $cond: {
                        if: { $and: match_D },
                        then: 'D',
                        else: {
                          $cond: {
                            if: { $and: match_E },
                            then: 'E',
                            else: {
                              $cond: {
                                if: { $and: match_F },
                                then: 'F',
                                else: {
                                  $cond: {
                                    if: { $and: match_G },
                                    then: 'G',
                                    else: {
                                      $cond: {
                                        if: { $and: match_H },
                                        then: 'H',
                                        else: {
                                          $cond: {
                                            if: { $and: match_I },
                                            then: 'I',
                                            else: {
                                              $cond: {
                                                if: { $and: match_J },
                                                then: 'J',
                                                else: {
                                                  $cond: {
                                                    if: { $and: match_K },
                                                    then: 'K',
                                                    else: {
                                                      $cond: {
                                                        if: { $and: match_L },
                                                        then: 'L',
                                                        else: {
                                                          $cond: {
                                                            if: { $and: match_M },
                                                            then: 'M',
                                                            else: {
                                                              $cond: {
                                                                if: { $and: match_N },
                                                                then: 'N',
                                                                else: {
                                                                  $cond: {
                                                                    if: { $and: match_O },
                                                                    then: 'O',
                                                                    else: {
                                                                      $cond: {
                                                                        if: {
                                                                          $and: [
                                                                            {
                                                                              $eq: [
                                                                                '$HouseOrCommercialType',
                                                                                HouseOrCommercialType,
                                                                              ],
                                                                            },
                                                                            { $eq: ['$Type', type] },
                                                                            { $lte: ['$distance', 5000] },
                                                                          ],
                                                                        },
                                                                        then: 'PA',
                                                                        else: false,
                                                                        // else: {
                                                                        //   $cond: {
                                                                        //     if: { $and: [match_B,{$lte:["$distance",5000]}] },
                                                                        //     then: 'PB',
                                                                        //     else: {
                                                                        //       $cond: {
                                                                        //         if: { $and: [match_C,{$lte:["$distance",5000]}] },
                                                                        //         then: 'PC',
                                                                        //         else: {
                                                                        //           $cond: {
                                                                        //             if: { $and: [match_D,{$lte:["$distance",5000]}] },
                                                                        //             then: 'PD',
                                                                        //             else: {
                                                                        //               $cond: {
                                                                        //                 if: { $and: [match_E,{$lte:["$distance",5000]}] },
                                                                        //                 then: 'PE',
                                                                        //                 else: {
                                                                        //                   $cond: {
                                                                        //                     if: { $and: [match_F,{$lte:["$distance",5000]}] },
                                                                        //                     then: 'PF',
                                                                        //                     else: {
                                                                        //                       $cond: {
                                                                        //                         if: { $and: [match_G,{$lte:["$distance",5000]}] },
                                                                        //                         then: 'PG',
                                                                        //                         else: {
                                                                        //                           $cond: {
                                                                        //                             if: { $and: [match_H,{$lte:["$distance",5000]}] },
                                                                        //                             then: 'PH',
                                                                        //                             else:false
                                                                        //                           },
                                                                        //                         },
                                                                        //                       },
                                                                        //                     },
                                                                        //                   },
                                                                        //                 },
                                                                        //               },
                                                                        //             },
                                                                        //           },
                                                                        //         },
                                                                        //       },
                                                                        //     },
                                                                        //   },
                                                                        // },
                                                                      },
                                                                    },
                                                                  },
                                                                },
                                                              },
                                                            },
                                                          },
                                                        },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        usersStatus: { $ifNull: ['$users.status', 'unViewed'] },
      },
    },
    {
      $match: { $and: [{ condition: { $ne: false } }] },
    },
    { $sort: { condition: 1 } },
    {
      $skip: range * (page + 1),
    },
    {
      $limit: range,
    },
  ]);

  index;
  let ind;
  if (index) {
    ind = parseInt(index);
  } else {
    ind = 0;
  }
  return {
    values: perfectMatch,
    next: total.length != 0,
    nextData: perfectMatch[ind],
  };
};

const BuyerLike_Property = async (id, userId) => {
  let like = await SellerPost.findById(id);
  if (!like) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Property Not Found');
  }
  let likes = await PropertLikes.findOne({ userId: userId, propertyId: id });
  if (likes) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already Like Submitted');
  }
  let data = { userId: userId, propertyId: id, created: moment(), status: 'Liked' };
  let values = await PropertLikes.create(data);
  return values;
};
// update Seller Renter Post
const UpdateSellerPost = async (id, updatebody, imageCount, userId) => {
  // const { type } = updatebody;
  // let today = moment().toDate();
  // let commingCount = imageCount;
  let sellerpost = await SellerPost.findById(id);
  if (!sellerpost) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Post Available');
  }
  // if (!type === 'edit') {
  //   if (!sellerpost.planedata.planId) {
  //     let imageCount = sellerpost.planedata.imageUpload;
  //     if (sellerpost.planedata.imageUpload <= 0) {
  //       throw new ApiError(httpStatus.BAD_REQUEST, 'Image Upload Plan Exceeded');
  //     }
  //     let data = {
  //       imageUpload: sellerpost.planedata.imageUpload - commingCount,
  //       videoUpload: sellerpost.planedata.videoUpload,
  //     };
  //     await SellerPost.findByIdAndUpdate({ _id: id }, { planedata: data }, { new: true });
  //   } else {
  //     let plan = await userPlane.findById(sellerpost.planedata.planId);
  //     let planValidate = plan.planValidate;
  //     let currentDate = moment().toDate();
  //     let imageCount = sellerpost.planedata.imageUpload;
  //     if (!planValidate > currentDate) {
  //       throw new ApiError(httpStatus.BAD_REQUEST, 'plan validate Expired');
  //     }
  //     let post = await SellerPost.findById(id);
  //     if (post.planedata.imageUpload <= 0) {
  //       throw new ApiError(httpStatus.BAD_REQUEST, 'Image Upload Plan Exceeded');
  //     }
  //     let data = {
  //       planId: post.planedata.planId,
  //       imageUpload: post.planedata.imageUpload - commingCount,
  //       videoUpload: post.planedata.videoUpload,
  //     };
  //     await SellerPost.findByIdAndUpdate({ _id: id }, { planedata: data }, { new: true });
  //     console.log(data);
  //   }
  // }
  sellerpost = await SellerPost.findByIdAndUpdate({ _id: id }, updatebody, { new: true });
  return sellerpost;
};

const VideoUpload = async (id) => {
  let values = await SellerPost.findById(id);
  return values;
};
// Otp Send
const getOTP = async (body) => {
  let otp = await StoreOtp.findOne({ number: body.number }).sort({ created: -1 });
  return await OTP.Otp(body);
};

const getOtpWithRegisterNumber = async (body) => {
  let value = await Buyer.findOne({ mobile: body.number, Type: body.Type });
  if (!value) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mobile Number Not Registered');
  }
  return await OTP.Otp(body);
};

const OTPVerify = async (body) => {
  let values = await StoreOtp.findOne({ otp: body.otp, active: true });
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }
  await StoreOtp.findByIdAndUpdate({ _id: values._id }, { active: false }, { new: true });
  let value = await Buyer.findOne({ mobile: values.number, Type: body.type });
  console.log(value.Type);
  let value1 = { _id: value._id, userName: value.userName, mobile: value.mobile, email: value.email, Type: value.Type };
  return { Message: 'otp verified successfully message', value: value1 };
};

const VerifyOtpRealEstate = async (body) => {
  const { type } = body;
  let verify = await StoreOtp.findOne({ otp: body.otp, active: true });
  if (!verify) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Otp');
  }
  verify = await StoreOtp.findOneAndUpdate({ otp: body.otp }, { active: false }, { new: true });
  let dates = moment().toDate();
  let currentDate = moment(dates);
  let otpDate = moment(verify.created);
  let diff = currentDate.diff(otpDate, 'minute');
  if (diff >= 2) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'OTP Expired');
  }
  let values = await Buyer.findOne({ mobile: verify.number, Type: type });
  values = await Buyer.findByIdAndUpdate({ _id: values._id }, { active: true }, { new: true });
  return values;
};

const updatePassword = async (id, body) => {
  let users = await Buyer.findById(id);
  if (!users) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not Found');
  }
  let findByOld = await Buyer.findOne({ _id: id, password: body.oldPassword });
  if (!findByOld) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Old Password Incorrect');
  }
  users = await Buyer.findByIdAndUpdate({ _id: id }, { password: body.password }, { new: true });
  return { Message: 'Password Updated SuccessFully' };
};

// create password

const createPassword = async (id, body) => {
  let { password, confirmPassword } = body;
  let values = await Buyer.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Verified');
  }
  let data = await Buyer.findByIdAndUpdate(
    { _id: id },
    { password: confirmPassword, active: true, accountActive: true, verified: true },
    { new: true }
  );
  return data;
};

const Login = async (body) => {
  const getEmailBy = await Buyer.findOne({ email: body.email, Type: body.Type });
  if (!getEmailBy) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not Registered');
  }
  let values = await Buyer.findOne({ email: body.email, password: body.password, active: true, Type: body.Type });
  if (!values) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User Not Available');
  }
  return values;
};

const LoginWithOtp = async (body) => {
  let verify = await StoreOtp.findOne({ otp: body.otp, active: true });
  if (!verify) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid OTP');
  }
  let values = await Buyer.findOne({ mobile: verify.number, verified: true });
  if (!values) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User Not Vailable');
  }
  verify = await StoreOtp.findByIdAndUpdate({ _id: verify._id }, { active: false }, { new: true });
  return values;
};

const giveInterest = async (id, userId) => {
  let users = await Buyer.findById(userId);
  // let today = moment().toDate();
  // if (!users) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'User Must be Logged In');
  // }
  let post = await SellerPost.findOne({ _id: id, viewedUsers: { $elemMatch: { $eq: userId } } });
  // if (!post) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Not Used In this Property');
  // }
  let matchValue = await SellerPost.findOne({ _id: id, intrestedUsers: { $elemMatch: { $eq: userId } } });
  if (!matchValue) {
    post = await SellerPost.findByIdAndUpdate({ _id: post._id }, { $push: { intrestedUsers: userId } }, { new: true });
    let viewdData = await PropertyBuyerRelation.findOne({ userId: userId, propertyId: post._id });
    if (!viewdData) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'This User Not Viewd this Property');
    }
    viewdData = await PropertyBuyerRelation.findByIdAndUpdate(
      { _id: viewdData._id },
      {
        status: 'Intrested',
        intrestedDate: moment().toDate(),
        $push: { history: { status: 'Intrested', date_Time: moment().toDate() } },
      },
      { new: true }
    );
    await shortList.create({ created: moment(), propertyId: post._id, userId: userId });
    await post.save();
    // sent Notification to seller
    await SellerNotification.create({
      postId: post._id,
      buyerId: userId,
      sellerId: post.userId,
      type: 'Intrest',
    });
  } else {
    post = await SellerPost.findByIdAndUpdate({ _id: post._id }, { $pull: { intrestedUsers: userId } }, { new: true });
    let viewdData = await PropertyBuyerRelation.findOne({ userId: userId, propertyId: post._id });
    viewdData = await PropertyBuyerRelation.findByIdAndUpdate({ _id: viewdData._id }, { status: 'Viewed' }, { new: true });
  }

  return post;
};

const getIntrestedUsersByProperty = async (id) => {
  let users = [];
  let values = await SellerPost.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'post Not Available');
  }
  for (let i = 0; i < values.intrestedUsers.length; i++) {
    let ff = await Buyer.findById(values.intrestedUsers[i]);
    // if (!ff) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, 'Intrsted User May Deleted Or There Is No Intrested');
    // }
    let accept = await SellerPost.findOne({ Accept: { $elemMatch: { $eq: ff._id } } });
    let acceptStatus = true;
    if (!accept) {
      acceptStatus = false;
    }
    if (ff) {
      let data = {
        verified: ff.verified,
        _id: ff._id,
        userName: ff.userName,
        mobile: ff.mobile,
        email: ff.email,
        Type: ff.Type,
        created: ff.created,
        date: ff.date,
        acceptStatus: acceptStatus,
      };
      users.push(data);
    }
  }
  return users;
};

const getPostedProperty_For_IndividualSeller = async (id, pag, rang, query) => {
  let page = parseInt(pag);
  let range = parseInt(rang);
  console.log(range);
  console.log(query);
  let fin;
  if ((query.finish = 'true')) {
    fin = true;
  } else {
    fin = false;
  }
  let values = await SellerPost.aggregate([
    {
      $match: { userId: id, finsh: fin },
    },
    {
      $sort: { created: -1 },
    },
    {
      $project: {
        _id: 1,
        viewedUsers: 1,
        intrestedUsers: 1,
        AdditionalDetails: 1,
        image: 1,
        propertyExpired: 1,
        propStatus: 1,
        HouseOrCommercialType: 1,
        propertType: 1,
        ageOfBuilding: 1,
        BHKType: 1,
        furnishingStatus: 1,
        bathRoomCount: 1,
        landSize: 1,
        noOfFloor: 1,
        floorNo: 1,
        IfCommercial: 1,
        Type: 1,
        BuildingName: 1,
        BuildedSize: 1,
        buildingDirection: 1,
        discription: 1,
        availability: 1,
        RentPrefer: 1,
        Address: 1,
        pineCode: 1,
        city: 1,
        locality: 1,
        parkingFacilities: 1,
        bathRoomType: 1,
        balconyCount: 1,
        roomType: 1,
        floorType: 1,
        MonthlyRentFrom: 1,
        MonthlyRentTo: 1,
        depositeAmount: 1,
        periodOfRentFrom: 1,
        periodOfRentTo: 1,
        lat: 1,
        long: 1,
        Negociable: 1,
        created: 1,
        date: 1,
        userId: 1,
        videos: 1,
        Accept: 1,
        active: 1,
        WhishList: 1,
        viwersCount: { $size: '$viewedUsers' },
        WhishListCount: { $size: '$WhishList' },
        intrestedCount: { $size: '$intrestedUsers' },
        AcceptCount: { $size: '$Accept' },
        IgnoreCount: { $size: '$Ignore' },
        rentDetails: 1,
        buildingType: 1,
        area: 1,
        expectedPrice: 1,
      },
    },
    {
      $skip: page * range,
    },
    {
      $limit: range,
    },
  ]);
  let total = await SellerPost.aggregate([
    {
      $match: { userId: id, finsh: fin },
    },
  ]);
  return { values: values, total: total.length };
};

const createAdminLogin = async (body) => {
  let data = { ...body, ...{ created: moment() } };
  let values = await Admin.create(data);
  return values;
};

const AdminLoginFlow = async (body) => {
  let values = await Admin.findOne({ userName: body.userName, password: body.password });
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin Not Found');
  }
  return values;
};

// map Api's

const getCoordinatesByAddress = async (location) => {
  let response = await Axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyD8NFC9JWmp2ofQFhglFmovCa-pzPUn-gE`
  );
  return response.data;
};

const updatePlanes = async (id, body) => {
  let values = await Buyer.findById(id);
  return values;
};

const AddViewed_Data = async (id, userId) => {
  let planValidate = moment().toDate();
  let users = await Buyer.findById(userId);
  let checkProperty = await SellerPost.findOne({ _id: id, viewedUsers: { $in: [userId] } });
  // if (users.contactView <= 0) {
  //   if (!checkProperty) {
  //     let userPlan = await userPlane
  //       .findOne({
  //         userId: userId,
  //         planValidate: { $gte: planValidate },
  //         PlanRole: 'Buyer',
  //         active: true,
  //         ContactNumber: { $gt: 0 },
  //       })
  //       .sort({ created: -1 });
  //     if (!userPlan) {
  //       throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Exceeded');
  //     }
  // let property = await SellerPost.findOne({ _id: id, viewedUsers: { $in: [userId] } });
  //   if (!property) {
  //     let exist = parseInt(userPlan.ContactNumber);
  //     let total = exist - 1;
  //     let plans = await userPlane.findByIdAndUpdate({ _id: userPlan._id }, { ContactNumber: total }, { new: true });
  //     if (plans.ContactNumber === 0) {
  //       await userPlane.findByIdAndUpdate({ _id: userPlan._id }, { active: true }, { new: true });
  //     }
  //   }
  // }
  // }

  // if (users.contactView > 0) {
  //   let property = await SellerPost.findOne({ _id: id, viewedUsers: { $in: [userId] } });
  //   if (!property) {
  //     let existCount = users.contactView;
  //     let total = existCount - 1;
  //     users = await Buyer.findByIdAndUpdate({ _id: userId }, { contactView: total }, { new: true });
  //   }
  // }
  let values = await SellerPost.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post Not Found');
  }
  let data = await SellerPost.findOne({ _id: values._id, viewedUsers: { $in: [userId] } });
  if (!data) {
    await SellerPost.findByIdAndUpdate({ _id: values._id }, { $push: { viewedUsers: userId } }, { new: true });
    await PropertyBuyerRelation.create({
      created: moment(),
      propertyId: values._id,
      userId: userId,
      history: { status: 'Viewed', date_Time: moment().toDate() },
      status: 'Viewed',
    });
    console.log('working.....');
    await ViewedDetails.create({ created: moment(), propertyId: values._id, userId: userId });
  }
  let userPropRelation = await PropertyBuyerRelation.findOne({ propertyId: id, userId: userId });
  return { values: values, userStatus: userPropRelation };
};

const BuyerSeller_Profile = async (userId) => {
  let values = await BuyerSeller.findById(userId);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Fount Token Issue');
  }
  console.log(values);
  let userData = {
    verified: values.verified,
    _id: values._id,
    Role: values.Role,
    userName: values.userName,
    mobile: values.mobile,
    email: values.email,
    Type: values.Type,
    created: values.created,
    date: values.date,
  };
  return values;
};

// change password By Loged In users

const updatePasswordByUsers = async (id, body) => {
  let values = await BuyerSeller.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Available Token Issue');
  }
  values = await BuyerSeller.findByIdAndUpdate({ _id: id }, { password: body.confirmNewPassword }, { new: true });
  let message = { Message: 'Password SuccessFully Updated' };
  return message;
};

const getIntrestedPropertyByUser = async (id) => {
  let dates = moment().toDate();
  let users = await Buyer.findById(id);
  let values = await SellerPost.aggregate([
    {
      $match: {
        intrestedUsers: { $in: [id] },
        active: true,
      },
    },
    {
      $lookup: {
        from: 'properbuyerrelations',
        localField: '_id',
        foreignField: 'propertyId',
        pipeline: [
          {
            $match: { userId: id },
          },
          { $sort: { created: -1 } },
          { $limit: 1 },
        ],
        as: 'userStatus',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$userStatus',
      },
    },
    {
      $project: {
        _id: 1,
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
        ageOfBuilding: 1,
        BuildingName: 1,
        BHKType: 1,
        landSize: 1,
        BuildedSize: 1,
        buildingDirection: 1,
        availability: 1,
        RentPrefer: 1,
        discription: 1,
        noOfFloor: 1,
        floorNo: 1,
        propertStatus: 1,
        Address: 1,
        city: 1,
        locality: 1,
        pineCode: 1,
        lat: 1,
        long: 1,
        parkingFacilities: 1,
        furnishingStatus: 1,
        bathRoomCount: 1,
        bathRoomType: 1,
        balconyCount: 1,
        roomType: 1,
        floorType: 1,
        MonthlyRentFrom: 1,
        MonthlyRentTo: 1,
        depositeAmount: 1,
        periodOfRentFrom: 1,
        propertyExpiredDate: 1,
        Negociable: 1,
        created: 1,
        date: 1,
        userId: 1,
        visit: 1,
        area: 1,
        expectedPrice: 1,
        status: { $gt: ['$visit', dates] },
        dates: dates,
        Accept: 1,
        rentDetails: 1,
        buildingType: 1,
        depositeAmount: 1,
        rentDetails: 1,
        AcceptStatus: {
          $ifNull: [{ $map: { input: '$Accept', as: 'value', in: { $eq: ['$$value', id] } } }, []],
        },
        IgnoreStatus: {
          $ifNull: [{ $map: { input: '$Ignore', as: 'value', in: { $eq: ['$$value', id] } } }, []],
        },
        userStatus: '$userStatus',
      },
    },
    {
      $project: {
        _id: 1,
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
        ageOfBuilding: 1,
        BuildingName: 1,
        BHKType: 1,
        landSize: 1,
        BuildedSize: 1,
        depositeAmount: 1,
        rentDetails: 1,
        buildingDirection: 1,
        availability: 1,
        RentPrefer: 1,
        discription: 1,
        noOfFloor: 1,
        floorNo: 1,
        propertStatus: 1,
        Address: 1,
        city: 1,
        locality: 1,
        pineCode: 1,
        buildingType: 1,
        lat: 1,
        long: 1,
        parkingFacilities: 1,
        furnishingStatus: 1,
        bathRoomCount: 1,
        bathRoomType: 1,
        balconyCount: 1,
        roomType: 1,
        floorType: 1,
        MonthlyRentFrom: 1,
        MonthlyRentTo: 1,
        depositeAmount: 1,
        periodOfRentFrom: 1,
        propertyExpiredDate: 1,
        Negociable: 1,
        created: 1,
        date: 1,
        userId: 1,
        visit: 1,
        status: 1,
        dates: 1,
        Accept: 1,
        area: 1,
        expectedPrice: 1,
        rentDetails: 1,
        // IgnoreStatus: 1,
        AcceptStatus: { $cond: { if: { $in: [true, '$AcceptStatus'] }, then: true, else: false } },
        IgnoreStatus: { $cond: { if: { $in: [true, '$IgnoreStatus'] }, then: true, else: false } },
        userStatus: '$userStatus',
      },
    },
  ]);
  return values;
};

const WhishList = async (propId, id) => {
  let values = await BuyerSeller.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User  Not Found Token Issues');
  }
  let data = await SellerPost.findById(propId);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Post Not Available');
  }
  let datas = await SellerPost.findOne({ _id: data._id, WhishList: { $in: [id] } });
  if (!datas) {
    data = await SellerPost.findByIdAndUpdate({ _id: data._id }, { $push: { WhishList: id } }, { new: true });
    await whishListDetails.create({ created: moment(), propertyId: data._id, userId: id });
  } else {
    data = await SellerPost.findByIdAndUpdate({ _id: data._id }, { $pull: { WhishList: id } }, { new: true });
  }
  return data;
};

const RemoveWhishList = async (propId, id) => {
  console.log(id);
  let values = await BuyerSeller.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User  Not Found Token Issues');
  }
  let data = await SellerPost.findById(propId);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Post Not Available');
  }
  let datas = await SellerPost.findOne({ _id: data._id, WhishList: { $in: [id] } });
  if (datas) {
    data = await SellerPost.findByIdAndUpdate({ _id: data._id }, { $pull: { WhishList: id } }, { new: true });
    await data.save();
  }
  return data;
};

const AcceptIgnore = async (propId, body, userId) => {
  let values = await SellerPost.findById(propId);
  let datas;
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post Not Match');
  }
  if (body.type === 'Accept') {
    values = await SellerPost.findOne({ _id: propId, Accept: { $in: [userId] } });
    if (!values) {
      values = await SellerPost.findByIdAndUpdate({ _id: propId }, { $push: { Accept: userId } }, { new: true });
      let users = await PropertyBuyerRelation.findOne({ userId: userId, propertyId: propId });
      users = await PropertyBuyerRelation.findByIdAndUpdate(
        { _id: users._id },
        {
          created: moment().toDate(),
          status: 'Accepted',
          $push: { history: { status: 'Accepted', date_Time: moment().toDate() } },
        },
        { new: true }
      );
    }
  }
  if (body.type === 'Ignore') {
    values = await SellerPost.findOne({ _id: propId, Ignore: { $in: [userId] } });
    console.log(values);
    if (!values) {
      values = await SellerPost.findByIdAndUpdate({ _id: propId }, { $push: { Ignore: userId } }, { new: true });
      let users = await PropertyBuyerRelation.findOne({ userId: userId, propertyId: propId });
      users = await PropertyBuyerRelation.findByIdAndUpdate(
        { _id: users._id },
        {
          created: moment().toDate(),
          status: 'Ignored',
          $push: { history: { status: 'Ignored', date_Time: moment().toDate() } },
        },
        { new: true }
      );
    }
  }
  return values;
};

const updateBuyerRelation = async (id, body, userId) => {
  let values = await PropertyBuyerRelation.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Property not Found');
  }
  if (body.type === 'Rejected') {
    await PropertyBuyerRelation.updateOne(
      { _id: id },
      { $push: { history: { rejected: moment().toDate() } } },
      { new: true }
    );
    values = await PropertyBuyerRelation.findByIdAndUpdate(
      { _id: id },
      {
        status: 'Rejected',
        rejected: moment().toDate(),
        rejectedDate: moment().toDate(),
        $push: { history: { status: 'Rejected', date_Time: moment().toDate() } },
      },
      { new: true }
    );
  }
  if (body.type === 'Shcedule') {
    let findIntrest = await PropertyBuyerRelation.findOne({
      userId: body.buyerId,
      status: { $in: ['Intrested', 'request_Reschedule'] },
      propertyId: body.postId,
    });
    console.log(findIntrest._id);
    await PropertyBuyerRelation.findByIdAndUpdate(
      { _id: findIntrest._id },
      {
        scheduleDate: body.schedule,
        scheduletime: body.scheduletime,
        propertyId: body.postId,
        userId: body.buyerId,
        status: body.type,
        $push: { history: { status: 'Schedule', date_Time: moment().toDate() } },
      },
      { new: true }
    );
    await SellerNotification.create({
      postId: body.postId,
      buyerId: body.buyerId,
      sellerId: userId,
      scheduleDate: body.schedule,
      scheduleTime: body.scheduletime,
      type: 'Schedule', 
    });
  }
  if (body.type === 'Visited') {
    let findIntrest = await PropertyBuyerRelation.findOne({
      _id: id,
    });
    await PropertyBuyerRelation.findByIdAndUpdate(
      { _id: findIntrest._id },
      {
        status: body.type,
        $push: { history: { status: 'Visited', date_Time: moment().toDate() } },
      },
      { new: true }
    );
    await SellerNotification.create({
      postId: body.postId,
      buyerId: findIntrest.userId,
      sellerId: userId,
      type: 'Visited',
    });
  }
  if (body.type === 'Fixed') {
    let findIntrest = await PropertyBuyerRelation.findOne({
      _id: id,
    });
    await PropertyBuyerRelation.findByIdAndUpdate(
      { _id: findIntrest._id },
      {
        status: body.type,
        $push: { history: { status: 'Fixed', date_Time: moment().toDate() } },
      },
      { new: true }
    );
    await SellerNotification.create({
      postId: body.postId,
      buyerId: findIntrest.userId,
      sellerId: userId,
      type: 'Fixed',
    });
  }
  return values;
};

// get Whishlist property for Buyers

const getWhishListed_Property_By_Buyer = async (id) => {
  let values = await BuyerSeller.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found, Token Issues');
  }
  const data = await SellerPost.aggregate([
    {
      $match: { active: true, WhishList: { $in: [id] }, finsh: true },
    },
    {
      $lookup: {
        from: 'properbuyerrelations',
        localField: '_id',
        foreignField: 'propertyId',
        pipeline: [
          {
            $match: { userId: id },
          },
          { $sort: { created: -1 } },
          { $limit: 1 },
        ],
        as: 'userStatus',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$userStatus',
      },
    },
  ]);
  return data;
};

// update Seller Post Raw Data

const UpdateSellerPost_As_Raw_Data = async (id, body, userId) => {
  let values = await SellerPost.findOne({ _id: id, active: true, userId: userId });
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'POst Not Found');
  }
  values = await SellerPost.findByIdAndUpdate({ _id: id }, body, { new: true });
  if (body.lat != null && body.long != null) {
    values.locationCoordinates = { type: 'Point', coordinates: [parseFloat(body.long), parseFloat(body.lat)] };
    values.location = { type: 'Point', coordinates: [parseFloat(body.long), parseFloat(body.lat)] };
    values.save();
  }
  return values;
};

// disable SellerPost By Id

const Disable_Seller_Post = async (id) => {
  let values = await SellerPost.findOne({ _id: id, active: true });
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post Not Available');
  }
  values = await SellerPost.findByIdAndUpdate({ _id: id }, { active: false }, { new: true });
  return values;
};

const getSellerPost = async (id) => {
  let values = await SellerPost.findOne({ _id: id, active: true });
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SellerPOst Not FOund');
  }
  return values;
};
//visitUsers
const getProperty_And_Shedule_Visite = async (id, body) => {
  let data = await SellerPost.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Post Not Available');
  }
  data = await SellerPost.findByIdAndUpdate({ _id: id }, { visit: body.date }, { new: true });
  return data;
};
// Buyers
const userPlane_Details = async (userId) => {
  let currentDate = moment().toDate();
  let values = await userPlane
    .findOne({
      active: true,
      // planValidate: { $gte: currentDate },
      PlanRole: 'Buyer',
      // ContactNumber: { $gt: 0 },
      userId: userId,
    })
    .sort({ created: -1 });
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'there is No Plan');
  }
  let plan = await AdminPlan.findById(values.PlanId);
  if (!plan) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Missing');
  }
  console.log(plan);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Exceeded');
  }
  let data = {
    _id: values._id,
    active: values.active,
    Amount: values.Amount,
    PayMentMethod: values.PayMentMethod,
    PlanId: values._id,
    planName: values.planName,
    ContactNumber: values.ContactNumber,
    offer: values.offer,
    PlanRole: values.PlanRole,
    planValidate: values.planValidate,
    created: values.created,
    userId: values.userId,
    totalContactNumber: plan.ContactNumber,
    description: plan.description,
  };
  return data;
};

// sellers

const userPlane_DetailsForSellers = async (userId) => {
  let currentDate = moment().toDate();
  let values = await userPlane
    .findOne({
      active: true,
      planValidate: { $gte: currentDate },
      PlanRole: 'Seller',
      // PostNumber: { $gt: 0 },
      userId: userId,
    })
    .sort({ created: -1 });
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found ');
  }
  let plan = await AdminPlan.findById(values.PlanId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'There is No Plan');
  }
  console.log(plan);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Exceeded');
  }
  // let data = {
  //   active: values.active,
  //   _id: values._id,
  //   Amount: values.Amount,
  //   PayMentMethod: values.PayMentMethod,
  //   PlanId: values.PlanId,
  //   planName: values.planName,
  //   PostNumber: values.PostNumber,
  //   Videos: values.Videos,
  //   PlanRole: values.PlanRole,
  //   planValidate: values.planValidate,
  //   created: values.created,
  //   userId: values.userId,
  //   TotalPostNumber: plan.PostNumber,
  // };
  let planDetails = {
    totalPost: plan.PostNumber,
    currentPost: plan.PostNumber - values.PostNumber,
    totalVideo: plan.Videos,
    currentVideo: values.Videos,
    totalImage: plan.images,
    currentImage: values.Image,
    planName: values.planName,
  };
  return planDetails;
};

const getAccepUserByProperty = async (id) => {
  let values = await SellerPost.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post Not Available');
  }
  let users = [];
  for (let i = 0; i < values.Accept.length; i++) {
    let userData = await Buyer.findById(values.Accept[i]);
    if (userData) {
      const data = {
        _id: userData._id,
        userName: userData.userName,
        mobile: userData.mobile,
        email: userData.email,
        Type: userData.Type,
      };
      users.push(data);
    }
  }
  return users;
};

const getIgnoreUserByProperty = async (id) => {
  let values = await SellerPost.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post Not Available');
  }
  let users = [];
  for (let i = 0; i < values.Ignore.length; i++) {
    let userData = await Buyer.findById(values.Ignore[i]);
    if (userData) {
      const data = {
        _id: userData._id,
        userName: userData.userName,
        mobile: userData.mobile,
        email: userData.email,
        Type: userData.Type,
      };
      users.push(data);
    }
  }
  return users;
};

const GetBuyerPost = async (userId) => {
  let values = await BuyerRentie.findOne({ userId: userId, active: true });
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buyer Post Not Available');
  }
  console.log(values);
  return values;
};

// map api neighbour
const neighbour_api = async (lat, long, type, radius) => {
  // console.log(location,type,radius)
  let response = await Axios.get(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${radius}&type=${type}&keyword=${type}&key=AIzaSyD8NFC9JWmp2ofQFhglFmovCa-pzPUn-gE`
  );

  return response.data;
};

const Places_AutoComplete = async (input, city) => {
  //https://maps.googleapis.com/maps/api/place/autocomplete/json?input=alwarepet&key=AIzaSyD8NFC9JWmp2ofQFhglFmovCa-pzPUn-gE
  let res = await Axios.get(
    // `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input},&type=${city}&key=AIzaSyD8NFC9JWmp2ofQFhglFmovCa-pzPUn-gE`
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=AIzaSyD8NFC9JWmp2ofQFhglFmovCa-pzPUn-gE`
  );
  return res.data;
};

const verify_locality = async (city, body) => {
  const { terms } = body;
  let filters = terms.filter((e) => e.value == city);
  if (filters.length > 0) {
    let values = body;
    return values;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, `Please select another locality`);
  }
};

const DeActive_UserAccount = async (userId) => {
  let users = await BuyerSeller.findOne({ _id: userId });
  if (!users) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User May De-Activate OR User Not Found');
  }
  users = await BuyerSeller.findByIdAndUpdate({ _id: userId }, { active: false }, { new: true });
  return { message: `${users.userName} Account De-Activated` };
};

const changePassword = async (userId, body) => {
  const { oldPassword, newPassword } = body;
  let values = await Buyer.findOne({ _id: userId, password: oldPassword });
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Old PassWord Incorrect Or Invalid User');
  }
  values = await Buyer.findByIdAndUpdate({ _id: userId }, { password: newPassword }, { new: true });

  return { Message: 'Password Updated SuccessFully' };
};

const Activate_DeActivatedUsers = async (body) => {
  return body;
};

// contructionDocuments upload

const DocumentUpload = async (id, body) => {
  let sellerposts = await SellerPost.findById(id);
  if (!sellerposts) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Seller Post Not Available');
  }
  sellerposts = await SellerPost.findByIdAndUpdate({ _id: id }, body, { new: true });
  return sellerposts;
};

// get Buyer And Owners BY Type

const getBuyers_And_Owners = async (type, page, range, query) => {
  range = parseInt(range);
  let roleMatch = { active: { $ne: null } };
  console.log(typeof type);
  let typeMatch = { active: { $ne: null } };
  if (type != 'null') {
    typeMatch = { Type: { $eq: type } };
  } else {
    typeMatch;
  }
  if (query.role) {
    roleMatch = { Role: query.role };
  } else {
    roleMatch;
  }
  const endUsers = await Buyer.aggregate([
    {
      $match: {
        $and: [typeMatch, roleMatch],
      },
    },
    {
      $skip: range * page,
    },
    {
      $limit: range,
    },
  ]);
  const total = await Buyer.aggregate([
    {
      $match: {
        $and: [typeMatch, roleMatch],
      },
    },
  ]);
  return { endUsers: endUsers, total: total.length };
};

// delete the users from DataBase

const DeleteByUserId = async (userId) => {
  let values = await Buyer.findById(userId);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Found');
  }
  values = await Buyer.findByIdAndDelete(userId);
  return { Message: 'Deleted' };
};

// Admin Flow

const deActivatedAccount = async (userId) => {
  let users = await Buyer.findById(userId);
  if (!users) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Activated Or Not Found');
  }
  users = await Buyer.findByIdAndUpdate({ _id: userId }, { active: false }, { new: true });
  return users;
};

const ActivatedAccount = async (userId) => {
  let users = await Buyer.findById(userId);
  if (!users) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Activated Or Not Found');
  }
  users = await Buyer.findByIdAndUpdate({ _id: userId }, { active: true }, { new: true });
  return users;
};

const InserDataExist = async (id, body) => {
  let values = await SellerPost.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post Not Found');
  }
  values = await SellerPost.findByIdAndUpdate({ _id: id }, body, { new: true });
  return values;
};

const getViewdInformationByProperty = async (id) => {
  let values = await ViewedDetails.aggregate([
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
      $lookup: {
        from: 'buyerrenties',
        localField: 'userId',
        foreignField: 'userId',
        as: 'needPost',
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
        propertyId: 1,
        userId: 1,
        created: 1,
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
        propertyId: 1,
        userId: 1,
        created: 1,
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

const getwishListInformationByProperty = async (id) => {
  let values = await whishListDetails.aggregate([
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
        propertyId: 1,
        userId: 1,
        created: 1,
        userName: '$users.userName',
        mobile: '$users.mobile',
        email: '$users.email',
        Type: '$users.Type',
      },
    },
  ]);
  return values;
};

const getshortListinformationByproperty = async (id) => {
  let values = await shortList.aggregate([
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
        propertyId: 1,
        userId: 1,
        created: 1,
        userName: '$users.userName',
        mobile: '$users.mobile',
        email: '$users.email',
        Type: '$users.Type',
      },
    },
  ]);
  return values;
};

const updateBuyerPost = async (id, updatebody) => {
  let data = await BuyerRentie.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'post Not Availabale');
  }
  data = await BuyerRentie.findByIdAndUpdate({ _id: id }, updatebody, { new: true });
  return data;
};

const getUserPlan = async (userId) => {
  const userData = await Buyer.findById(userId);
  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Found');
  }
  let data;
  if (userData.Type === 'Buyer') {
    data = {
      userName: userData.userName,
      mobile: userData.mobile,
      email: userData.email,
      contactView: userData.contactView,
    };
    return data;
  }
  if (userData.Type === 'Seller') {
    data = {
      userName: userData.userName,
      mobile: userData.mobile,
      email: userData.email,
      postPlan: userData.plane,
      video: userData.videos,
      image: userData.Image,
    };
    return data;
  }
};

const getDataById = async (id, userId) => {
  let intreststatus;
  let savedStatus;
  let values = await SellerPost.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SellerPost Not Found');
  }
  let intrest = await SellerPost.findOne({ intrestedUsers: { $elemMatch: { $eq: userId } }, _id: id });
  let saved = await SellerPost.findOne({ WhishList: { $elemMatch: { $eq: userId } }, _id: id });
  let relation = await PropertyBuyerRelation.findOne({ propertyId: id, userId: userId });
  if (intrest != null) {
    intreststatus = true;
  } else {
    intreststatus = false;
  }
  if (saved != null) {
    savedStatus = true;
  } else {
    savedStatus = false;
  }

  const status_check = await PropertyBuyerRelation.find({
    userId: userId,
    propertyId: id,
    status: { $in: ['Reschedule', 'Shcedule'] },
  });

  let counts = status_check.length;
  let show = false;
  if (counts > 0) {
    show = true;
  }
  return {
    values: values,
    intrest: intreststatus,
    savedStatus: savedStatus,
    relation: relation,
    show: show,
  };
};

const getAddress_By_Lat_long = async (query) => {
  let { lat, long } = query;
  lat = parseFloat(lat);
  long = parseFloat(long);
  console.log(lat);
  let apikey = 'AIzaSyD8NFC9JWmp2ofQFhglFmovCa-pzPUn-gE';
  let values = await Axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apikey}`);
  return values.data.results;
};

const videoUpload = async (req) => {
  let values = await SellerPost.findById(req.params.id);
  // console.log(req.body.type);
  // const { type } = req.body;
  // if (!values) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Post Not Available');
  // }
  // let userId = values.userId;
  // // plan flow
  // let uploadFile = req.files.length;
  // if (!type == 'edit') {
  //   if (!values.planedata.planId) {
  //     let videoCount = uploadFile;
  //     console.log(videoCount);
  //     if (values.planedata.videoUpload <= 0) {
  //       throw new ApiError(httpStatus.BAD_REQUEST, 'Video Plan Exceeded');
  //     }
  //     let data = {
  //       imageUpload: values.planedata.imageUpload,
  //       videoUpload: values.planedata.videoUpload - videoCount,
  //     };
  //     await SellerPost.findByIdAndUpdate({ _id: req.params.id }, { planedata: data }, { new: true });
  //   } else {
  //     let plan = await userPlane.findById(values.planedata.planId);
  //     let planValidate = plan.planValidate;
  //     let currentDate = moment().toDate();
  //     if (!planValidate > currentDate) {
  //       throw new ApiError(httpStatus.BAD_REQUEST, 'plan validate Expired');
  //     }
  //     let post = await SellerPost.findById(req.params.id);
  //     if (post.planedata.videoUpload <= 0) {
  //       throw new ApiError(httpStatus.BAD_REQUEST, 'video Upload Plan Exceeded');
  //     }
  //     let data = {
  //       planId: post.planedata.planId,
  //       imageUpload: post.planedata.imageUpload,
  //       videoUpload: post.planedata.videoUpload - uploadFile,
  //     };
  //     await SellerPost.findByIdAndUpdate({ _id: req.params.id }, { planedata: data }, { new: true });
  //   }
  // }

  const s3 = new AWS.S3({
    accessKeyId: 'AKIA3323XNN7Y2RU77UG',
    secretAccessKey: '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',
    region: 'ap-south-1',
  });
  let Data = [];
  return new Promise((resolve, reject) => {
    for (let i = 0; i < req.files.length; i++) {
      let params = {
        Bucket: 'realestatevideoupload',
        Key: req.files[i].originalname,
        Body: req.files[i].buffer,
      };

      s3.upload(params, async (err, data) => {
        if (err) {
          reject(err);
        } else {
          Data.push(data);
          if (Data.length === req.files.length) {
            values = await SellerPost.findByIdAndUpdate({ _id: values._id }, { $set: { videos: [] } }, { new: true });
            for (let j = 0; j < Data.length; j++) {
              values = await SellerPost.findByIdAndUpdate(
                { _id: values._id },
                { $push: { videos: Data[i].Location } },
                { new: true }
              );
            }
          }
        }
      });
    }
    setTimeout(() => {
      resolve(values);
    }, 1000);
  });
};

const localities = async (coordinates) => {
  const { lat, long } = coordinates;

  return coordinates;
};

const delete_DraftBy_user = async (userId) => {
  let getDraft = await SellerPost.find({ userId: userId, finsh: false });
  if (getDraft.length > 0) {
    await SellerPost.deleteMany({ userId: userId, finsh: false });
  }
  return { message: 'Draft Deleted SuccessFully' };
};

const get_DraftBy_user = async (userId) => {
  let getDraft = await SellerPost.findOne({ userId: userId, finsh: false }).sort({ created: -1 });
  if (!getDraft) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'There Is No Draft Available');
  }
  return getDraft;
};

const prev_Next = async (index) => {
  let i = parseInt(index);
  let values = await SellerPost.aggregate([
    {
      $skip: i,
    },
    {
      $limit: 1,
    },
  ]);
  return values;
};

const forgotPassword = async (id, body) => {
  let values = await Buyer.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }
  values = await Buyer.findByIdAndUpdate({ _id: id }, { password: body.password }, { new: true });
  return { message: 'Password Rest SuccessFully' };
};

const updateuserProfile = async (id, body) => {
  let values = await Buyer.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Available');
  }
  values = await Buyer.findByIdAndUpdate({ _id: id }, body, { new: true });
  return values;
};

const getSellerPostById = async (id) => {
  let values = await SellerPost.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Post Not Available ');
  }
  return values;
};

const UsersDetails = async (id) => {
  let values = await Buyer.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Available');
  }
  return values;
};

const PropertyDeatails_after_intrested = async (id) => {
  let values = await PropertyBuyerRelation.aggregate([
    {
      $match: {
        propertyId: id,
        status: {
          $in: [
            'Intrested',
            'Rejected',
            'Shcedule',
            'Ignored',
            'Accept',
            'Visited',
            'Fixed',
            'Reschedule',
            'request_Reschedule',
          ],
        },
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
        userId: 1,
        propertyId: 1,
        status: 1,
        history: 1,
        intrestedDate: 1,
        email: '$users.email',
        userName: '$users.userName',
        mobile: '$users.mobile',
        created: '$intrestedDate',
      },
    },
  ]);
  return values;
};

const Delete_Property_image = async (id, body) => {
  let values = await SellerPost.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Property Not Available');
  }
  await SellerPost.updateOne({ _id: id }, { $pull: { image: body.url } }, { new: true });
  return values;
};

const Delete_property_video = async (id) => {
  let values = await SellerPost.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Property Not Available');
  }
  values = await SellerPost.findByIdAndUpdate({ _id: id }, { videos: [] }, { new: true });
  return values;
};

const post_active_inactive = async (id, body) => {
  let values = await SellerPost.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Property Not Available');
  }
  if (body.status == 'active') {
    values = await SellerPost.findByIdAndUpdate({ _id: id }, { active: true }, { new: true });
  } else {
    values = await SellerPost.findByIdAndUpdate({ _id: id }, { active: false }, { new: true });
  }
  return values;
};

const Remove_Post = async (id) => {
  let values = await SellerPost.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Property Not Available');
  }
  values = await SellerPost.findByIdAndUpdate({ _id: id }, { finsh: false }, { new: true });
  return values;
};

const getSellerPostBySeller = async (id) => {
  let values = await SellerPost.find({ userId: id, finsh: true });
  return values;
};

const getNotificationDetails = async (userId) => {
  let values = await SellerNotification.aggregate([
    {
      $match: {
        active: true,
        sellerId: userId,
        type: { $nin: ['Schedule', 'request_Reschedule'] },
      },
    },
    {
      $lookup: {
        from: 'buyers',
        localField: 'buyerId',
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
        from: 'sellerposts',
        localField: 'postId',
        foreignField: '_id',
        as: 'posts',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$posts',
      },
    },
  ]);
  return values;
};

const getNotificationFor_Buyers = async (userId) => {
  let values = await SellerNotification.aggregate([
    {
      $match: {
        buyerId: userId,
        type: { $in: ['Schedule', 'Visited', 'Accept', 'Fixed'] },
      },
    },
    {
      $lookup: {
        from: 'buyers',
        localField: 'buyerId',
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
        from: 'sellerposts',
        localField: 'postId',
        foreignField: '_id',
        as: 'posts',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$posts',
      },
    },
  ]);
  return values;
};

const getIntrestedPropertyByUser_pagination = async (userId, query) => {
  let { type, ctype, page, range, ind } = query;
  page = parseInt(page);
  range = parseInt(range);
  if (!ind) {
    ind = 0;
  } else {
    ind = parseInt(ind);
  }
  const data = await SellerPost.aggregate([
    {
      $match: { intrestedUsers: { $in: [userId] }, HouseOrCommercialType: { $eq: ctype }, Type: { $eq: type } },
    },
    {
      $lookup: {
        from: 'properbuyerrelations',
        localField: '_id',
        foreignField: 'propertyId',
        pipeline: [{ $match: { userId: userId } }, { $sort: { created: -1 } }, { $limit: 1 }],
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
      $skip: parseInt(range) * parseInt(page),
    },
    {
      $limit: parseInt(range),
    },
  ]);
  const total = await SellerPost.aggregate([
    {
      $match: { intrestedUsers: { $in: [userId] }, HouseOrCommercialType: { $eq: ctype }, Type: { $eq: type } },
    },
    {
      $lookup: {
        from: 'properbuyerrelations',
        localField: '_id',
        foreignField: 'propertyId',
        pipeline: [{ $match: { userId: userId } }, { $sort: { created: -1 } }, { $limit: 1 }],
        as: 'users',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$users',
      },
    },
  ]);
  return { values: data, total: total.length, nextData: data[ind] };
};

const getsavedPropertyByUser_pagination = async (userId, query) => {
  let { type, ctype, page, range, ind } = query;
  page = parseInt(page);
  range = parseInt(range);
  if (!ind) {
    ind = 0;
  } else {
    ind = parseInt(ind);
  }

  console.log(query);
  const data = await SellerPost.aggregate([
    {
      $match: { WhishList: { $in: [userId] }, HouseOrCommercialType: { $eq: ctype }, Type: { $eq: type } },
    },
    {
      $lookup: {
        from: 'properbuyerrelations',
        localField: '_id',
        foreignField: 'propertyId',
        pipeline: [{ $match: { userId: userId } }, { $sort: { created: -1 } }, { $limit: 1 }],
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
      $skip: parseInt(range) * parseInt(page),
    },
    {
      $limit: parseInt(range),
    },
  ]);
  const total = await SellerPost.aggregate([
    {
      $match: { WhishList: { $in: [userId] }, HouseOrCommercialType: { $eq: ctype }, Type: { $eq: type } },
    },
    {
      $lookup: {
        from: 'properbuyerrelations',
        localField: '_id',
        foreignField: 'propertyId',
        pipeline: [{ $match: { userId: userId } }, { $sort: { created: -1 } }, { $limit: 1 }],
        as: 'users',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$users',
      },
    },
  ]);
  return { values: data, total: total.length, nextData: data[ind] };
};

module.exports = {
  createBuyerSeller,
  verifyOtp,
  updateBuyerRelation,
  createSellerPost,
  LoginWithmail,
  createBuyerRentiee,
  SearchHouseFlatByBuyer_Or_Rentiee,
  DisplayAvailable_HouseOr_Flat,
  AutoMatches_ForBuyer_rentiee,
  createBuyer,
  verifyOtpBuyer,
  createAdmin,
  AdminLogin,
  getSellerRenter_POST_ForAdmin,
  ApproveAndReject,
  LoginWithmailBuyer,
  getApprover_Property,
  BuyerLike_Property,
  UpdateSellerPost,
  VideoUpload,
  getOTP,
  VerifyOtpRealEstate,
  createPassword,
  Login,
  LoginWithOtp,
  giveInterest,
  getIntrestedUsersByProperty,
  getPostedProperty_For_IndividualSeller,
  getOtpWithRegisterNumber,
  OTPVerify,
  updatePassword,
  createAdminLogin,
  AdminLoginFlow,
  getCoordinatesByAddress,
  updatePlanes,
  AddViewed_Data,
  BuyerSeller_Profile,
  updatePasswordByUsers,
  getIntrestedPropertyByUser,
  WhishList,
  RemoveWhishList,
  getWhishListed_Property_By_Buyer,
  UpdateSellerPost_As_Raw_Data,
  Disable_Seller_Post,
  getSellerPost,
  getProperty_And_Shedule_Visite,
  userPlane_Details,
  userPlane_DetailsForSellers,
  AcceptIgnore,
  getAccepUserByProperty,
  getIgnoreUserByProperty,
  GetBuyerPost,
  neighbour_api,
  DeActive_UserAccount,
  changePassword,
  Activate_DeActivatedUsers,
  DocumentUpload,
  getBuyers_And_Owners,
  DeleteByUserId,
  deActivatedAccount,
  ActivatedAccount,
  InserDataExist,
  getViewdInformationByProperty,
  getwishListInformationByProperty,
  getshortListinformationByproperty,
  updateBuyerPost,
  getUserPlan,
  Places_AutoComplete,
  verify_locality,
  getDataById,
  getAddress_By_Lat_long,
  videoUpload,
  localities,
  delete_DraftBy_user,
  get_DraftBy_user,
  prev_Next,
  forgotPassword,
  updateuserProfile,
  getSellerPostById,
  UsersDetails,
  PropertyDeatails_after_intrested,
  Delete_Property_image,
  Delete_property_video,
  post_active_inactive,
  Remove_Post,
  getSellerPostBySeller,
  getNotificationDetails,
  getNotificationFor_Buyers,
  BuyerReshedule,
  getApprover_Property_new,
  getIntrestedPropertyByUser_pagination,
  getsavedPropertyByUser_pagination,
};
