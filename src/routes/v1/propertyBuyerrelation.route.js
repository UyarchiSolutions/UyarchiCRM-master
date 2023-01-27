const express = require('express');
const propertyRelationController = require('../../controllers/propertyBuyerrelation.controller');
const Auth = require('../../controllers/BuyerAuth');
const router = express.Router();

router.route('/property/:id').get(propertyRelationController.getPropertyBuyerRelations);
router.route('/reject/:propId/:userId').get(propertyRelationController.rejectForSellerSide);
router.route('/FixedAndDumbedProperty/:propId/:userId/:type').get(propertyRelationController.FixedAndDumbedProperty);
router.route('/visiteAndNoShow/:propId/:userId/:type').get(propertyRelationController.visiteAndNoShow);
router.route('/getviewed/AndMore').get(Auth, propertyRelationController.getviewedAndMore_Reports);
module.exports = router;
