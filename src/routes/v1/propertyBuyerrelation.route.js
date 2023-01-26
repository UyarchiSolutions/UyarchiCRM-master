const express = require('express');
const propertyRelationController = require('../../controllers/propertyBuyerrelation.controller');
const router = express.Router();

router.route('/property/:id').get(propertyRelationController.getPropertyBuyerRelations);
router.route('/reject/:propId/:userId').get(propertyRelationController.rejectForSellerSide);
module.exports = router;
