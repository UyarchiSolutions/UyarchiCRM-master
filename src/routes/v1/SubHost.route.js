const express = require('express');
const SubHostController = require('../../controllers/SubHost.controller');
const router = express.Router();
const Authorization = require('../../controllers/BuyerAuth');
const SubHostAuth = require('../../controllers/SubHostAuthentication.controller');

router.route('/').post(Authorization, SubHostController.create_SubHost);
router.route('/created/subHost').get(Authorization, SubHostController.get_created_Subhost_By_Seller);
router.route('/Active/Inactive/SubHost/:id').put(SubHostController.Active_Inactive_SubHost);
router.route('/updateSubHos/:id').put(SubHostController.updateSubHost);
router.route('/getSubHostById/:id').get(SubHostController.getSubHostById);
router.route('/sendOtpTOSubHost').post(SubHostController.sendOtpTOSubHost);
router.route('/verifyOtpforSubhost').post(SubHostController.verifyOtpforSubhost);
router.route('/setPassword/:id').put(SubHostController.setPassword);
router.route('/Login').post(SubHostController.Login);
router.route('/getSubHost/ForChat').get(Authorization, SubHostController.getSubHostForChat);
router.route('/getSubHost/ForStream').get(Authorization, SubHostController.getSubHostForStream);
router.route('/getSubHostBy/Login/users').get(SubHostAuth, SubHostController.getSubHostBy_Login);
router.route('/getStream/By/SubHost').get(SubHostAuth, SubHostController.getStream_By_SubHost);
router.route('/changePassword').post(SubHostController.changePassword);
router.route('/changePassword/SubHost').post(SubHostAuth, SubHostController.changePassword_SubHost);
router.route('/DeleteSubHostById/:id').delete(SubHostController.DeleteSubHostById);
module.exports = router;
