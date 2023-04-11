const express = require('express');
const propertyAlertController = require('../../controllers/property.alert.controller');
const router = express.Router();
const SellerBuyerAuth = require('../../controllers/buyerSellerAuth');

router.route('/').post(SellerBuyerAuth, propertyAlertController.createpropertyalert);
router.route('/Update/:id').put(SellerBuyerAuth, propertyAlertController.UpdateById);
module.exports = router;
