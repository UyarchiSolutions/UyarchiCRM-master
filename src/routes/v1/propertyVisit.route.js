const express = require('express');
const propertyVisitController = require('../../controllers/propertyVisit.Controller');
const router = express.Router();
const Auth = require('../../controllers/BuyerAuth');

router.route('/').post(propertyVisitController.createPropertyVisit);
router.route('/getVisit/PropertyBy/Buyer').get(Auth, propertyVisitController.getVisit_PropertyBy_Buyer);

module.exports = router;
