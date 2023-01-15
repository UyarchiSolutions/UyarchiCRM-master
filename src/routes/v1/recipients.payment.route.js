const express = require('express');
const router = express.Router();
const RecipentPaymentController = require('../../controllers/recipients.Payment.controller');
const authorization = require('../../controllers/authorization.controller');

router.route('/').post(authorization, RecipentPaymentController.createPayment);

module.exports = router;
