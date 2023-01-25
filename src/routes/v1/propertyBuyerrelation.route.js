const express = require('express');
const propertyRelationController = require('../../controllers/propertyBuyerrelation.controller');
const router = express.Router();

router.route('/property/:id').get(propertyRelationController.getPropertyBuyerRelations);

module.exports = router;
