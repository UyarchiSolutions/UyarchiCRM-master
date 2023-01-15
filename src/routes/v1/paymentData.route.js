const express = require('express');
const paymentDataController = require('../../controllers/paymentData.controller');
const router = express.Router();
router.route('/').post(paymentDataController.createpaymentDataService).get(paymentDataController.getpaymentDataServiceAll)
router
  .route('/:paymentId')
  .get(paymentDataController.getpaymentDataServiceById)
  .put(paymentDataController.updatepaymentDataService)
  .delete(paymentDataController.deletepaymentDataService);

module.exports = router;