const express = require('express');
const propertyRelationController = require('../../controllers/propertyBuyerrelation.controller');
const router = express.Router();

router.route('/property/:id').get(propertyRelationController.getPropertyBuyerRelations);
router.route('/reject/:propId/:userId').get(propertyRelationController.rejectForSellerSide);
router.route('/FixedAndDumbedProperty/:propId/:userId/:type').get(propertyRelationController.FixedAndDumbedProperty);
module.exports = router;
