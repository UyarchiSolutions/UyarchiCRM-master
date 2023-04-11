const express = require('express');
const propertyAlertController = require('../../controllers/property.alert.controller');
const router = express.Router();
const SellerBuyerAuth = require('../../controllers/buyerSellerAuth');

router.route('/').post(SellerBuyerAuth, propertyAlertController.createpropertyalert);
module.exports = router;
