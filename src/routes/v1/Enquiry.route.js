const express = require('express');
const EnquiryController = require('../../controllers/Enquiry.controller');
const router = express.Router();
const Auth = require('../../controllers/BuyerAuth');

router.route('/').post(EnquiryController.createEnquiry).get(EnquiryController.getEnquiry);
router.route('/sendReplay/Enquiry').post(EnquiryController.sendReplayEnquiry);
router.route('/remove/:id').get(EnquiryController.remove);
router.route('/create/FAQ').post(EnquiryController.createFAQ)
module.exports = router;
