const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const buyersellerService = require('../services/BuyerSeller.service');
const mailService = require('../services/email.service');
const { BuyerSeller, BuyerSellerOTP, Buyer, SellerPost } = require('../models/BuyerSeller.model');
const tokenService = require('../services/token.service');
const userPlane = require('../models/usersPlane.model');
const AWS = require('aws-sdk');
const moment = require('moment');
const properBuyerrelation = require('../models/propertyBuyerRelation.model');

const createBuyerSeller = catchAsync(async (req, res) => {
  const { email, mobile, Type } = req.body;
  const checkemail = await BuyerSeller.findOne({ email: email, Type: Type });
  if (checkemail) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'email Already Registered');
  }
  const checkmobile = await BuyerSeller.findOne({ mobile: mobile, Type: Type });
  if (checkmobile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mobile Already registered');
  }
  let values;
  if (Type === 'Seller') {
    values = await mailService.sendEmailSeller(req.body.email, mobile);
  }
  if (Type === 'Buyer') {
    values = await mailService.sendEmail(req.body.email, mobile);
  }

  const data = await buyersellerService.createBuyerSeller(req.body, values.otp);
  res.send(data);
});

// Active De-Activated users
const Activate_DeActivatedUsers = catchAsync(async (req, res) => {
  const { email, number } = req.body;
  let values = await Buyer.findOne({ active: false, email: email, mobile: number });
  console.log(values);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User Not Exist OR User Not De-Activated');
  }
  let mail;
  if (values.Type === 'Seller') {
    mail = await mailService.sendEmailSeller(email, number);
  }
  mail = await mailService.sendEmail(email, number);
  const data = await buyersellerService.Activate_DeActivatedUsers(req.body);
  res.send({ Message: 'Verification Mail Send....' });
});

const verifyOtp = catchAsync(async (req, res) => {
  const data = await buyersellerService.verifyOtp(req.body);
  const tokens = await tokenService.generateAuthTokens(data);
  res.send({ data: data, tokens: tokens });
});

const verifyOtpBuyer = catchAsync(async (req, res) => {
  const data = await buyersellerService.verifyOtpBuyer(req.body);
  const token = await tokenService.generateAuthTokens(data);
  res.send({ data: data, tokens: token });
});

const createSellerPost = catchAsync(async (req, res) => {
  let userId = req.userId;
  console.log(userId);
  const data = await buyersellerService.createSellerPost(req.body, userId);
  if (req.files) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
      path = 'images/buyrSeller/' + files.filename;
    });
    data.image = path;
  }
  res.status(httpStatus.CREATED).send(data);
  await data.save();
});

const LoginWithmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  let val = await BuyerSeller.findOne({ email: email, verified: true });
  if (!val) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Email Not Registered');
  }
  let values = await mailService.sendEmail(email);
  const data = await buyersellerService.LoginWithmail(req.body, values.otp);
  res.send(data);
});

// login With Mail For Buyer

const LoginWithmailBuyer = catchAsync(async (req, res) => {
  const { email } = req.body;
  let val = await Buyer.findOne({ email: email, verified: true });
  if (!val) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Email Not Registered');
  }
  let values = await mailService.sendEmail(email);
  const data = await buyersellerService.LoginWithmailBuyer(req.body, values.otp);
  res.send(data);
});

const createBuyerRentiee = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.createBuyerRentiee(req.body, userId);
  res.send(data);
});

const SearchHouseFlatByBuyer_Or_Rentiee = catchAsync(async (req, res) => {
  let userId = req.userId;
  let type = req.type;
  const data = await buyersellerService.SearchHouseFlatByBuyer_Or_Rentiee(userId);
  res.send(data);
});

const DisplayAvailable_HouseOr_Flat = catchAsync(async (req, res) => {
  let querydata = req.query;
  const data = await buyersellerService.DisplayAvailable_HouseOr_Flat(querydata);
  res.send(data);
});

const AutoMatches_ForBuyer_rentiee = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.AutoMatches_ForBuyer_rentiee(userId);
  res.send(data);
});

const createBuyer = catchAsync(async (req, res) => {
  const { email, mobile, Type } = req.body;
  const checkemail = await Buyer.findOne({ email: email, Type: Type });
  if (checkemail) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'email Already Registered');
  }
  const checkmobile = await BuyerSeller.findOne({ mobile: mobile, Type: Type });
  if (checkmobile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mobile Already registered');
  }
  let values;
  if (Type === 'Seller') {
    values = await mailService.sendEmailSeller(req.body.email, mobile);
  }
  if (Type === 'Buyer') {
    values = await mailService.sendEmail(req.body.email, mobile);
  }
  const data = await buyersellerService.createBuyer(req.body, values.otp);
  res.send(data);
});

// create Admin

const createAdmin = catchAsync(async (req, res) => {
  const data = await buyersellerService.createAdmin(req.body);
  res.send(data);
});

// admin Login

const AdminLogin = catchAsync(async (req, res) => {
  const data = await buyersellerService.AdminLogin(req.body);
  res.send(data);
});

const getSellerRenter_POST_ForAdmin = catchAsync(async (req, res) => {
  const data = await buyersellerService.getSellerRenter_POST_ForAdmin(req.params.type, req.params.propType, req.params.page);
  res.send(data);
});

const ApproveAndReject = catchAsync(async (req, res) => {
  const data = await buyersellerService.ApproveAndReject(req.params.id, req.body);
  res.send(data);
});

const getApprover_Property = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.getApprover_Property(req.query, userId, req.body);
  res.send(data);
});

const BuyerLike_Property = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.BuyerLike_Property(req.params.id, userId);
  res.send(data);
});

const UpdateSellerPost = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.UpdateSellerPost(req.params.id, req.body, req.files.image.length, userId);
  if (req.files) {
    data.image = [];
    if (req.files.image !== null) {
      req.files.image.map((e) => {
        data.image.push('images/buyrSeller/' + e.filename);
      });
    }
  }
  await data.save();
  res.send(data);
});

const VideoUpload = catchAsync(async (req, res) => {
  // const data = await buyersellerService.VideoUpload(req.params.id, req.body);
  // AWS.config.update({
  //   accessKeyId: 'AKIA3323XNN7Y2RU77UG',
  //   secretAccessKey: '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',
  //   region: 'ap-south-1',
  // });
  // const s3 = new AWS.S3();
  // console.log(req.file)
  // const fileContent = Buffer.from(req.file.data.data, 'binary');
  // const params = {
  //   Bucket: 'streamingupload',
  //   Key: req.files.data.name,
  //   Body: fileContent,
  // };
  // s3.upload(params, (err, data) => {
  //   if (err) {
  //     throw err;
  //   }
  //   res.send({ res: 200, message: 'Success', data: data });
  // });
  // console.log(req.body);
  res.send({ message: 'sucess' });
});

const getOTP = catchAsync(async (req, res) => {
  const data = await buyersellerService.getOTP(req.body);
  res.send(data);
});

const VerifyOtpRealEstate = catchAsync(async (req, res) => {
  const data = await buyersellerService.VerifyOtpRealEstate(req.body);
  res.send(data);
});

const createPassword = catchAsync(async (req, res) => {
  const data = await buyersellerService.createPassword(req.params.id, req.body);
  res.send(data);
});

const Login = catchAsync(async (req, res) => {
  const data = await buyersellerService.Login(req.body);
  const token = await tokenService.generateAuthTokens(data);
  res.send({ data: data, token: token });
});

const LoginWithOtp = catchAsync(async (req, res) => {
  const data = await buyersellerService.LoginWithOtp(req.body);
  const token = await tokenService.generateAuthTokens(data);
  res.send({ data: data, token: token });
});

const giveInterest = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.giveInterest(req.params.id, userId);
  res.send(data);
});

const getIntrestedUsersByProperty = catchAsync(async (req, res) => {
  const data = await buyersellerService.getIntrestedUsersByProperty(req.params.id);
  res.send(data);
});

const getPostedProperty_For_IndividualSeller = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.getPostedProperty_For_IndividualSeller(
    userId,
    req.params.page,
    req.params.range,
    req.query
  );
  res.send(data);
});

const getOtpWithRegisterNumber = catchAsync(async (req, res) => {
  const data = await buyersellerService.getOtpWithRegisterNumber(req.body);
  res.send(data);
});

const OTPVerify = catchAsync(async (req, res) => {
  const data = await buyersellerService.OTPVerify(req.body);
  res.send(data);
});

const updatePassword = catchAsync(async (req, res) => {
  const data = await buyersellerService.updatePassword(req.params.id, req.body);
  res.send(data);
});

const createAdminLogin = catchAsync(async (req, res) => {
  const data = await buyersellerService.createAdminLogin(req.body);
  res.send(data);
});

const AdminLoginFlow = catchAsync(async (req, res) => {
  const data = await buyersellerService.AdminLoginFlow(req.body);
  res.send(data);
});

const getCoordinatesByAddress = catchAsync(async (req, res) => {
  const data = await buyersellerService.getCoordinatesByAddress(req.query.address);
  res.send(data);
});

const updatePlanes = catchAsync(async (req, res) => {
  const data = await buyersellerService.updatePlanes(req.params.id, req.body);
  res.send(data);
});

const AddViewed_Data = catchAsync(async (req, res) => {
  let userId = req.userId;
  console.log(userId);
  const data = await buyersellerService.AddViewed_Data(req.params.id, userId);
  res.send(data);
});

const BuyerSeller_Profile = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.BuyerSeller_Profile(userId);
  res.send(data);
});

const updatePasswordByUsers = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.updatePasswordByUsers(userId, req.body);
  res.send(data);
});

const getIntrestedPropertyByUser = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.getIntrestedPropertyByUser(userId);
  res.send(data);
});

const WhishList = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.WhishList(req.params.id, userId);
  res.send(data);
});

const RemoveWhishList = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.RemoveWhishList(req.params.id, userId);
  res.send(data);
});

const getWhishListed_Property_By_Buyer = catchAsync(async (req, res) => {
  let userID = req.userId;
  const data = await buyersellerService.getWhishListed_Property_By_Buyer(userID);
  res.send(data);
});

const UpdateSellerPost_As_Raw_Data = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.UpdateSellerPost_As_Raw_Data(req.params.id, req.body, userId);
  res.send(data);
});

const Disable_Seller_Post = catchAsync(async (req, res) => {
  const data = await buyersellerService.Disable_Seller_Post(req.params.id);
  res.send(data);
});

const getSellerPost = catchAsync(async (req, res) => {
  const data = await buyersellerService.getSellerPost(req.params.id);
  res.send(data);
});

const getProperty_And_Shedule_Visite = catchAsync(async (req, res) => {
  const data = await buyersellerService.getProperty_And_Shedule_Visite(req.params.id, req.body);
  res.send(data);
});

const userPlane_Details = catchAsync(async (req, res) => {
  let userId = req.userId;
  console.log(userId);
  const data = await buyersellerService.userPlane_Details(userId);
  res.send(data);
});

const userPlane_DetailsForSellers = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.userPlane_DetailsForSellers(userId);
  res.send(data);
});

const AcceptIgnore = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.AcceptIgnore(req.params.id, req.body, userId);
  res.send(data);
});

const getAccepUserByProperty = catchAsync(async (req, res) => {
  const data = await buyersellerService.getAccepUserByProperty(req.params.id);
  res.send(data);
});

const getIgnoreUserByProperty = catchAsync(async (req, res) => {
  const data = await buyersellerService.getIgnoreUserByProperty(req.params.id);
  res.send(data);
});

const GetBuyerPost = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.GetBuyerPost(userId);
  res.send(data);
});

// map api neighbour

const neighbour_api = catchAsync(async (req, res) => {
  const { lat, long, type, radius } = req.query;
  const data = await buyersellerService.neighbour_api(lat, long, type, radius);
  res.send(data);
});

const DeActive_UserAccount = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.DeActive_UserAccount(userId);
  res.send(data);
});

const changePassword = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.changePassword(userId, req.body);
  res.send(data);
});

const VideoUploads = catchAsync(async (req, res) => {
  const data = await buyersellerService.videoUpload(req);

  res.send(data);
});

// contructionDocuments

const DocumentUpload = catchAsync(async (req, res) => {
  const data = await buyersellerService.DocumentUpload(req.params.id, req.body);
  if (req.files) {
    console.log(req.files);
    data.contructionDocuments = [];
    if (req.files.contructionDocuments !== null) {
      req.files.map((e) => {
        data.contructionDocuments.push('/images/sellerDocument/' + e.filename);
      });
    }
  }
  await data.save();
  res.send(data);
});

const getBuyers_And_Owners = catchAsync(async (req, res) => {
  const data = await buyersellerService.getBuyers_And_Owners(req.params.type, req.params.page);
  res.send(data);
});

const DeleteByUserId = catchAsync(async (req, res) => {
  const data = await buyersellerService.DeleteByUserId(req.params.id);
  res.send(data);
});

const deActivatedAccount = catchAsync(async (req, res) => {
  const data = await buyersellerService.deActivatedAccount(req.params.id);
  res.send(data);
});

const ActivatedAccount = catchAsync(async (req, res) => {
  const data = await buyersellerService.ActivatedAccount(req.params.id);
  res.send(data);
});

const InserDataExist = catchAsync(async (req, res) => {
  const data = await buyersellerService.InserDataExist(req.params.id, req.body);
  res.send(data);
});

const getViewdInformationByProperty = catchAsync(async (req, res) => {
  const { type } = req.body;
  let data;
  if (type === 'viewed') {
    data = await buyersellerService.getViewdInformationByProperty(req.params.id);
  }
  if (type === 'wishlist') {
    data = await buyersellerService.getwishListInformationByProperty(req.params.id);
  }
  if (type === 'shortlist') {
    data = await buyersellerService.getshortListinformationByproperty(req.params.id);
  }
  res.send(data);
});

const updateBuyerPost = catchAsync(async (req, res) => {
  const data = await buyersellerService.updateBuyerPost(req.params.id, req.body);
  res.send(data);
});

const getUserPlan = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.getUserPlan(userId);
  res.send(data);
});

const Places_AutoComplete = catchAsync(async (req, res) => {
  const { input, city } = req.query;
  const data = await buyersellerService.Places_AutoComplete(input, city);
  res.send(data);
});

const verify_locality = catchAsync(async (req, res) => {
  const data = await buyersellerService.verify_locality(req.params.city, req.body);
  res.send(data);
});

const getDataById = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.getDataById(req.params.id, userId);
  res.send(data);
});

const getAddress_By_Lat_long = catchAsync(async (req, res) => {
  const data = await buyersellerService.getAddress_By_Lat_long(req.query);
  res.send(data);
});

const localities = catchAsync(async (req, res) => {
  const data = await buyersellerService.localities(req.query);
  res.send(data);
});

const delete_DraftBy_user = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.delete_DraftBy_user(userId);
  res.send(data);
});

const get_DraftBy_user = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.get_DraftBy_user(userId);
  res.send(data);
});

const prev_Next = catchAsync(async (req, res) => {
  const data = await buyersellerService.prev_Next(req.params.index);
  res.send(data);
});

const forgotPassword = catchAsync(async (req, res) => {
  const data = await buyersellerService.forgotPassword(req.params.id, req.body);
  res.send(data);
});

const updateuserProfile = catchAsync(async (req, res) => {
  const userId = req.userId;
  const data = await buyersellerService.updateuserProfile(userId, req.body);
  res.send(data);
});

const getSellerPostById = catchAsync(async (req, res) => {
  const data = await buyersellerService.getSellerPostById(req.params.id);
  res.send(data);
});

const UsersDetails = catchAsync(async (req, res) => {
  let userId = req.userId;
  const data = await buyersellerService.UsersDetails(userId);
  res.send(data);
});

const PropertyDeatails_after_intrested = catchAsync(async (req, res) => {
  const data = await buyersellerService.PropertyDeatails_after_intrested(req.params.id);
  res.send(data);
});

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
  VideoUploads,
  DocumentUpload,
  getBuyers_And_Owners,
  DeleteByUserId,
  deActivatedAccount,
  ActivatedAccount,
  InserDataExist,
  getViewdInformationByProperty,
  updateBuyerPost,
  getUserPlan,
  Places_AutoComplete,
  verify_locality,
  getDataById,
  getAddress_By_Lat_long,
  localities,
  delete_DraftBy_user,
  get_DraftBy_user,
  prev_Next,
  forgotPassword,
  updateuserProfile,
  getSellerPostById,
  UsersDetails,
  PropertyDeatails_after_intrested,
};
