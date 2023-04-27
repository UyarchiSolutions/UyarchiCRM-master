const express = require('express');
const SubHostController = require('../../controllers/SubHost.controller');
const router = express.Router();
const Authorization = require('../../controllers/BuyerAuth');

router.route('/').post(Authorization, SubHostController.create_SubHost);
router.route('/created/subHost').get(Authorization, SubHostController.get_created_Subhost_By_Seller);
module.exports = router;
