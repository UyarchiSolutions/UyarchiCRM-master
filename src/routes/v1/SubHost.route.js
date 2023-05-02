const express = require('express');
const SubHostController = require('../../controllers/SubHost.controller');
const router = express.Router();
const Authorization = require('../../controllers/BuyerAuth');

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
module.exports = router;
