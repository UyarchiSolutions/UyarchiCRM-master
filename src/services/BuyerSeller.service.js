const httpStatus = require('http-status');
const { BuyerSeller, BuyerSellerOTP, SellerPost, BuyerRentie, Buyer, PropertLikes } = require('../models/BuyerSeller.model');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const Admin = require('../models/RealEstate.Admin.model');
const OTP = require('../config/textLocal');
const StoreOtp = require('../models/RealEstate.Otp.model');
const userPlane = require('../models/usersPlane.model');
const AdminPlan = require('../models/AdminPlan.model');
const { ViewedDetails, whishListDetails, shortList } = require('../models/BuyerPropertyRelation.model');
const PropertyBuyerRelation = require('../models/propertyBuyerRelation.model');
const Axios = require('axios');

const createBuyerSeller = async (body, otp) => {
  const { email, mobile } = body;
  let values = { ...body, ...{ created: moment(), date: moment().format('YYYY-MM-DD'), plane: 2 } };
  let values1 = { Otp: otp, email: email, mobile: mobile };
  const buyerSeller = await BuyerSeller.create(values);
  await BuyerSellerOTP.create(values1);
  return buyerSeller;
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
      // userId: userId,
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

  let values = await SellerPost.aggregate([{}]);
  return id;
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

const getSellerRenter_POST_ForAdmin = async (type, propType, page) => {
  console.log(type);
  let typeMatch = { active: true };
  let proptypeMatch = { active: true };
  if (type != 'null') {
    typeMatch = { HouseOrCommercialType: type };
  }
  if (propType != 'null') {
    proptypeMatch = { Type: propType };
  }
  const data = await SellerPost.aggregate([
    {
      $match: { $and: [typeMatch, proptypeMatch] },
    },
    {
      $skip: 10 * page,
    },
    {
      $limit: 10,
    },
  ]);
  const total = await SellerPost.aggregate([
    {
      $match: { $and: [typeMatch, proptypeMatch] },
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

const getApprover_Property = async (page, query, userId) => {
  let cityMatch = { active: true };
  let propertMatch = { active: true };
  let BHKTypeMatch = { active: true };
  let MonthlyRentFromMatch = { active: true };
  let MonthlyRentToMatch = { active: true };
  let HouseOrCommercialTypeMatch = { active: true };
  let typeMatch = { active: true };

  let area = query.area;
  // area filter
  if (area) {
    console.log(area, 'sdl;h');
    if (area != 'null') {
      cityMatch = { city: { $regex: query.area, $options: 'i' } };
    } else {
      cityMatch;
    }
  } else {
    cityMatch;
  }

  if (query.propertType) {
    if (query.propertType != 'null') {
      propertMatch = { propertType: { $regex: query.propertType, $options: 'i' } };
    } else {
      propertMatch;
    }
  } else {
    propertMatch;
  }

  if (query.BHKType) {
    if (query.BHKType != 'null') {
      BHKTypeMatch = { BHKType: { $regex: query.BHKType, $options: 'i' } };
    } else {
      BHKTypeMatch;
    }
  } else {
    BHKTypeMatch;
  }

  if (query.MonthlyRentFrom) {
    if (query.MonthlyRentFrom != 'null') {
      let MonthlyRentFrom = parseInt(query.MonthlyRentFrom);
      MonthlyRentFromMatch = { MonthlyRentFrom: { $gte: MonthlyRentFrom } };
    } else if (query.MonthlyRentTo) {
      let MonthlyRentTo = parseInt(query.MonthlyRentTo);
      MonthlyRentToMatch = { MonthlyRentFrom: { $gte: MonthlyRentTo } };
    } else {
      MonthlyRentFromMatch;
    }
  }

  if (query.HouseOrCommercialType) {
    if (query.HouseOrCommercialType != 'null') {
      HouseOrCommercialTypeMatch = { HouseOrCommercialType: query.HouseOrCommercialType };
    } else {
      HouseOrCommercialTypeMatch;
    }
  } else {
    HouseOrCommercialTypeMatch;
  }
  if (query.Type) {
    if (query.Type != 'null') {
      typeMatch = { Type: query.Type };
    } else {
      typeMatch;
    }
  } else {
    typeMatch;
  }

  let today = moment().toDate();
  let values = await SellerPost.aggregate([
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
          { propStatus: 'Approved' },
        ],
      },
    },
    {
      $sort: { created: -1 },
    },
    {
      $lookup: {
        from: 'properbuyerrelations',
        localField: '_id',
        foreignField: 'propertyId',
        pipeline: [{ $match: { userId: userId } }],
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
        expiredDate: 1,
        intrestedUsers: 1,
        WhishList: 1,
        scheduleDate: '$users.scheduleDate',
        lat: 1,
        usersStatus: { $ifNull: ['$users.status', 'unViewed'] },
        userscreated: { $ifNull: ['$users.created', 'unViewed'] },
        users: '$users',
        long: 1,
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
        IntrestedStatus: {
          $ifNull: [{ $cond: { if: { $in: [true, '$IntrestedStatus'] }, then: true, else: false } }, false],
        },
        whistListStatus: {
          $ifNull: [{ $cond: { if: { $in: [true, '$whistListStatus'] }, then: true, else: false } }, false],
        },
      },
    },
    // {
    //   $match: { status: { $eq: 'Pending' } },
    // },
    {
      $skip: 10 * page,
    },
    {
      $limit: 10,
    },
  ]);
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
          { propStatus: 'Approved' },
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
    // {
    //   $match: { status: { $eq: 'Pending' } },
    // },
  ]);
  return { values: values, total: total.length };
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
  if (otp) {
    if (otp.active == true) {
      if (!body.resend) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'OTP Already Send, Click Resend Otp');
      } else {
        return await OTP.Otp(body);
      }
    } else {
      return await OTP.Otp(body);
    }
  } else {
    return await OTP.Otp(body);
  }

  // return { message: 'Under Working.....' };
};

const getOtpWithRegisterNumber = async (body) => {
  let value = await Buyer.findOne({ mobile: body.number });
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
  let verify = await StoreOtp.findOne({ otp: body.otp });
  console.log(verify);
  await StoreOtp.findByIdAndUpdate({ _id: verify._id }, { active: false }, { new: true });
  let values = await Buyer.findOne({ mobile: verify.number, Type: type });
  values = await Buyer.findByIdAndUpdate({ _id: values._id }, { active: true }, { new: true });
  return values;
};

const updatePassword = async (id, body) => {
  let users = await Buyer.findById(id);
  if (!users) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not Found');
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
  let today = moment().toDate();
  if (!users) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User Must be Logged In');
  }
  let post = await SellerPost.findOne({ _id: id, viewedUsers: { $elemMatch: { $eq: userId } } });
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Not Used In this Property');
  }
  let matchValue = await SellerPost.findOne({ _id: id, intrestedUsers: { $elemMatch: { $eq: userId } } });
  if (!matchValue) {
    post = await SellerPost.findByIdAndUpdate({ _id: post._id }, { $push: { intrestedUsers: userId } }, { new: true });
    let viewdData = await PropertyBuyerRelation.findOne({ userId: userId, propertyId: post._id });
    if (!viewdData) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'This User Not Viewd this Property');
    }
    viewdData = await PropertyBuyerRelation.findByIdAndUpdate(
      { _id: viewdData._id },
      { status: 'Intrested', intrestedDate: moment().toDate(), $push: { history: { intrested: moment().toDate() } } }
    );
    await shortList.create({ created: moment(), propertyId: post._id, userId: userId });
    await post.save();
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
    if (!ff) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Intrsted User May Deleted Or There Is No Intrested');
    }
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

const getPostedProperty_For_IndividualSeller = async (id, page) => {
  let values = await SellerPost.aggregate([
    {
      $match: { userId: id },
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
      },
    },
    {
      $skip: page * 10,
    },
    {
      $limit: 10,
    },
  ]);
  let total = await SellerPost.aggregate([
    {
      $match: { userId: id },
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
    `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyDoYhbYhtl9HpilAZSy8F_JHmzvwVDoeHI`
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
  if (users.contactView <= 0) {
    if (!checkProperty) {
      let userPlan = await userPlane
        .findOne({
          userId: userId,
          planValidate: { $gte: planValidate },
          PlanRole: 'Buyer',
          active: true,
          ContactNumber: { $gt: 0 },
        })
        .sort({ created: -1 });
      if (!userPlan) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Exceeded');
      }
      let property = await SellerPost.findOne({ _id: id, viewedUsers: { $in: [userId] } });
      if (!property) {
        let exist = parseInt(userPlan.ContactNumber);
        let total = exist - 1;
        let plans = await userPlane.findByIdAndUpdate({ _id: userPlan._id }, { ContactNumber: total }, { new: true });
        if (plans.ContactNumber === 0) {
          await userPlane.findByIdAndUpdate({ _id: userPlan._id }, { active: true }, { new: true });
        }
      }
    }
  }

  if (users.contactView > 0) {
    let property = await SellerPost.findOne({ _id: id, viewedUsers: { $in: [userId] } });
    if (!property) {
      let existCount = users.contactView;
      let total = existCount - 1;
      users = await Buyer.findByIdAndUpdate({ _id: userId }, { contactView: total }, { new: true });
    }
  }
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
      history: { viewd: moment().toDate() },
      status: 'Viewd',
    });
    await ViewedDetails.create({ created: moment(), propertyId: values._id, userId: userId });
  }
  let userPropRelation = await PropertyBuyerRelation.findOne({ propertyId: id, userId: userId });
  console.log(userPropRelation);
  return { values: values, userStatus: userPropRelation };
};

const BuyerSeller_Profile = async (userId) => {
  let values = await BuyerSeller.findById(userId);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Fount Token Issue');
  }
  let userData = {
    verified: values.verified,
    _id: values._id,
    userName: values.userName,
    mobile: values.mobile,
    email: values.email,
    Type: values.Type,
    created: values.created,
    date: values.date,
  };
  return userData;
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
  let values = await SellerPost.aggregate([
    {
      $match: {
        intrestedUsers: { $in: [id] },
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
        status: { $gt: ['$visit', dates] },
        dates: dates,
        Accept: 1,
        AcceptStatus: {
          $ifNull: [{ $map: { input: '$Accept', as: 'value', in: { $eq: ['$$value', id] } } }, []],
        },
        IgnoreStatus: {
          $ifNull: [{ $map: { input: '$Ignore', as: 'value', in: { $eq: ['$$value', id] } } }, []],
        },
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
        status: 1,
        dates: 1,
        Accept: 1,
        // IgnoreStatus: 1,
        AcceptStatus: { $cond: { if: { $in: [true, '$AcceptStatus'] }, then: true, else: false } },
        IgnoreStatus: { $cond: { if: { $in: [true, '$IgnoreStatus'] }, then: true, else: false } },
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
    console.log(values);
    if (!values) {
      values = await SellerPost.findByIdAndUpdate({ _id: propId }, { $push: { Accept: userId } }, { new: true });
      let users = await PropertyBuyerRelation.findOne({ userId: userId, propertyId: propId });
      users = await PropertyBuyerRelation.findByIdAndUpdate(
        { _id: users._id },
        { created: moment().toDate(), status: 'Accepted', $push: { history: { accept: moment().toDate() } } },
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
        { created: moment().toDate(), status: 'Ignored', $push: { history: { Ignored: moment().toDate() } } },
        { new: true }
      );
    }
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
      $match: { active: true, WhishList: { $in: [id] } },
    },
  ]);
  return data;
};

// update Seller Post Raw Data

const UpdateSellerPost_As_Raw_Data = async (id, body) => {
  let values = await SellerPost.findOne({ _id: id, active: true });
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'POst Not Found');
  }
  values = await SellerPost.findByIdAndUpdate({ _id: id }, body, { new: true });
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
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${radius}&type=${type}&keyword=${type}&key=AIzaSyDoYhbYhtl9HpilAZSy8F_JHmzvwVDoeHI`
  );

  return response.data;
};

const Places_AutoComplete = async (input, city) => {
  //https://maps.googleapis.com/maps/api/place/autocomplete/json?input=alwarepet&key=AIzaSyDoYhbYhtl9HpilAZSy8F_JHmzvwVDoeHI
  let res = await Axios.get(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input},&type=${city}&key=AIzaSyDoYhbYhtl9HpilAZSy8F_JHmzvwVDoeHI`
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

const getBuyers_And_Owners = async (type, page) => {
  const endUsers = await Buyer.aggregate([
    {
      $match: {
        Type: type,
      },
    },
    {
      $skip: 10 * page,
    },
    {
      $limit: 10,
    },
  ]);
  const total = await Buyer.aggregate([
    {
      $match: {
        Type: type,
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

const getDataById = async (id) => {
  let values = await SellerPost.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SellerPost Not Found');
  }
  return values;
};

const getAddress_By_Lat_long = async (query) => {
  const { lat, long } = query;
  let apikey = 'AIzaSyDoYhbYhtl9HpilAZSy8F_JHmzvwVDoeHI';
  let values = await Axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}8&sensor=true&key=${apikey}`
  );
  return values.data.results;
};

module.exports = {
  createBuyerSeller,
  verifyOtp,
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
};
