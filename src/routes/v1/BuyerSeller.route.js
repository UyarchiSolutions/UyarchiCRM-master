const express = require('express');
const router = express.Router();
const BuyerSellerController = require('../../controllers/BuyerSeller.controller');
const SellerBuyerAuth = require('../../controllers/buyerSellerAuth');
const BuyerAuth = require('../../controllers/BuyerAuth');
const sellerBuyrimg = require('../../middlewares/buyrSeller');
const Video = require('../../middlewares/videoUpload');
const Vid = require('../../middlewares/vide');
const sellerDocument = require('../../middlewares/seller.document');

router.route('/Register').post(BuyerSellerController.createBuyer);
router.route('/verify').post(BuyerSellerController.verifyOtp);
router.route('/updateuserProfile').put(SellerBuyerAuth, BuyerSellerController.updateuserProfile);
router
  .route('/createSellerPost')
  .post(SellerBuyerAuth, sellerBuyrimg.array('image'), BuyerSellerController.createSellerPost);
router.route('/login').post(BuyerSellerController.LoginWithmail);
router.route('/buyer/render').post(SellerBuyerAuth, BuyerSellerController.createBuyerRentiee);
router.route('/SearchHouse').get(SellerBuyerAuth, BuyerSellerController.SearchHouseFlatByBuyer_Or_Rentiee);
router.route('/DisplayAvailable/HouseOr/Flat').get(BuyerSellerController.DisplayAvailable_HouseOr_Flat);
router.route('/AutoMatches/ForBuyer/rentiee').get(SellerBuyerAuth, BuyerSellerController.AutoMatches_ForBuyer_rentiee);
router.route('/createBuyer').post(BuyerSellerController.createBuyer);
router.route('/verifyOtpBuyer').post(BuyerSellerController.verifyOtpBuyer);
router.route('/createAdmin').post(BuyerSellerController.createAdmin);
router.route('/AdminLogin').post(BuyerSellerController.AdminLogin);
router
  .route('/getSellerRenter/POST/ForAdmin/:type/:propType/:page')
  .get(BuyerSellerController.getSellerRenter_POST_ForAdmin);
router.route('/ApproveAndReject/:id').put(BuyerSellerController.ApproveAndReject);
router.route('/Login/Buyer').post(BuyerSellerController.LoginWithmailBuyer);
router.route('/getApprover/Property').get(BuyerAuth, BuyerSellerController.getApprover_Property);
router.route('/BuyerLike/Property/:id').get(BuyerAuth, BuyerSellerController.BuyerLike_Property);
router
  .route('/Update/Seller/Post/:id')
  .put(sellerBuyrimg.fields([{ name: 'image' }]), BuyerSellerController.UpdateSellerPost);
router.route('/VideoUpload/:id').put(Video.single('video'), BuyerSellerController.VideoUpload);
router.route('/Send-OTP').post(BuyerSellerController.getOTP);
router.route('/VerifyOtpRealEstate').post(BuyerSellerController.VerifyOtpRealEstate);
router.route('/createPassword/:id').put(BuyerSellerController.createPassword);
router.route('/Login/verified').post(BuyerSellerController.Login);
router.route('/LoginWithOtp').post(BuyerSellerController.LoginWithOtp);
router.route('/giveInterest/:id').get(BuyerAuth, BuyerSellerController.giveInterest);
router.route('/getIntrestedUsersByProperty/:id').get(BuyerSellerController.getIntrestedUsersByProperty);
router
  .route('/getPostedProperty/For/IndividualSeller/:page/:range')
  .get(BuyerAuth, BuyerSellerController.getPostedProperty_For_IndividualSeller);
router.route('/getOtpWithRegisterNumber').post(BuyerSellerController.getOtpWithRegisterNumber);
router.route('/OTPVerify').post(BuyerSellerController.OTPVerify);
router.route('/updatePassword/:id').put(BuyerSellerController.updatePassword);
router.route('/createAdminLogin').post(BuyerSellerController.createAdminLogin);
router.route('/AdminLoginFlow').post(BuyerSellerController.AdminLoginFlow);
router.route('/getCoordinatesByAddress').get(BuyerSellerController.getCoordinatesByAddress);
router.route('/updatePlanes').put(BuyerSellerController.updatePlanes);
router.route('/AddViewed_Data/:id').get(BuyerAuth, BuyerSellerController.AddViewed_Data);
router.route('/BuyerSeller/Profile').get(BuyerAuth, BuyerSellerController.BuyerSeller_Profile);
router.route('/updatePasswordByUsers').post(BuyerAuth, BuyerSellerController.updatePasswordByUsers);
router.route('/getIntrestedPropertyByUser').get(BuyerAuth, BuyerSellerController.getIntrestedPropertyByUser);
router.route('/WhishList/:id').get(BuyerAuth, BuyerSellerController.WhishList);
router.route('/RemoveWhishList/:id').get(BuyerAuth, BuyerSellerController.RemoveWhishList);
router.route('/getWhishListed_Property_By_Buyer').get(BuyerAuth, BuyerSellerController.getWhishListed_Property_By_Buyer);
router.route('/UpdateSellerPost_As_Raw_Data/:id').put(BuyerAuth, BuyerSellerController.UpdateSellerPost_As_Raw_Data);
router.route('/Disable_Seller_Post/:id').get(BuyerSellerController.Disable_Seller_Post);
router.route('/getSellerPost/:id').get(BuyerSellerController.getSellerPost);
router.route('/getProperty_And_Shedule_Visite/:id').put(BuyerSellerController.getProperty_And_Shedule_Visite);
router.route('/userPlane_Details').get(BuyerAuth, BuyerSellerController.userPlane_Details);
router.route('/userPlane_DetailsForSellers').get(BuyerAuth, BuyerSellerController.userPlane_DetailsForSellers);
router.route('/AcceptIgnore/:id').put(BuyerAuth, BuyerSellerController.AcceptIgnore);
router.route('/getAccepUserByProperty/:id').get(BuyerSellerController.getAccepUserByProperty);
router.route('/getIgnoreUserByProperty/:id').get(BuyerSellerController.getIgnoreUserByProperty);
router.route('/GetBuyerPost').get(BuyerAuth, BuyerSellerController.GetBuyerPost);
router.route('/DeActive_UserAccount').get(BuyerAuth, BuyerSellerController.DeActive_UserAccount);
router.route('/changePassword').post(BuyerAuth, BuyerSellerController.changePassword);
router.route('/activate/deActivatedusers').post(BuyerSellerController.Activate_DeActivatedUsers);
router.route('/VideoUploads/:id').put(Vid, BuyerSellerController.VideoUploads);
router.route('/document/upload/:id').put(sellerDocument.array('contructionDocuments'), BuyerSellerController.DocumentUpload);
router.route('/getBuyers_And_Owners/:type/:page').get(BuyerSellerController.getBuyers_And_Owners);
router.route('/getpropertyRelation/:id').put(BuyerSellerController.getViewdInformationByProperty);
router.route('/updateBuyerPost/:id').put(BuyerSellerController.updateBuyerPost);
router.route('/getUserPlan').get(BuyerAuth, BuyerSellerController.getUserPlan);
router.route('/forgot/passowrd/:id').put(BuyerSellerController.forgotPassword);
// map api
router.route('/neighbour_api').get(BuyerSellerController.neighbour_api);
router.route('/Places/AutoComplete').get(BuyerSellerController.Places_AutoComplete);
router.route('/verify_locality/:city').put(BuyerSellerController.verify_locality);
router.route('/supplier/getMap/Location').get(BuyerSellerController.getAddress_By_Lat_long);

// Admin Flow
router.route('/ActivatedAccount/:id').get(BuyerSellerController.ActivatedAccount);
router.route('/de/ActivatedAccount/:id').get(BuyerSellerController.deActivatedAccount);
router.route('/delete/:id').get(BuyerSellerController.DeleteByUserId);
router.route('/sellerPost/:id').get(BuyerSellerController.getDataById);
router.route('/delete/DraftBy/user').get(BuyerAuth, BuyerSellerController.delete_DraftBy_user);
router.route('/get/DraftBy_user').get(BuyerAuth, BuyerSellerController.get_DraftBy_user);
// localities
router.route('/localities').get(BuyerSellerController.localities);
router.route('/prev_Next/:index').get(BuyerSellerController.prev_Next);
module.exports = router;
