const express = require('express');
const EnquiryController = require('../../controllers/Enquiry.controller');
const router = express.Router();
const Auth = require('../../controllers/BuyerAuth');

router.route('/').post(EnquiryController.createEnquiry).get(EnquiryController.getEnquiry);
router.route('/sendReplay/Enquiry').post(EnquiryController.sendReplayEnquiry);
router.route('/remove').get(EnquiryController.remove);

module.exports = router;
