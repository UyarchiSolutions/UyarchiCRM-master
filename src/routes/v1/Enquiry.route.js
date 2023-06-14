const express = require('express');
const EnquiryController = require('../../controllers/Enquiry.controller');
const router = express.Router();
const Auth = require('../../controllers/BuyerAuth');

router.route('/').post(EnquiryController.createEnquiry).get(EnquiryController.getEnquiry);
router.route('/sendReplay/Enquiry').post(EnquiryController.sendReplayEnquiry);
router.route('/remove/:id').get(EnquiryController.remove);
router.route('/create/faq').post(EnquiryController.createFAQ).get(EnquiryController.getFaq);
router.route('/updateFaq/:id').put(EnquiryController.updateFaq);
router.route('/getHeading/Only').get(EnquiryController.getHeadingOnly);
router.route('/RemoveFAQ/:id').get(EnquiryController.RemoveFAQ);
module.exports = router;
