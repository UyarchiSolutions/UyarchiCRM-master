const express = require('express');
const jobEnquiryController = require('../../controllers/jobEnquiry.controller');

const router = express.Router();
router.route('/').post(jobEnquiryController.createjobEnquiry).get(jobEnquiryController.getjobEnquiry);

module.exports = router;
