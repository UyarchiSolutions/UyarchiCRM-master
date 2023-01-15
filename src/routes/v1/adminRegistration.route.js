const express = require('express');
const adminRegistrationController = require('../../controllers/adminRegistration.controller');
const router = express.Router();

router.route('/').post(adminRegistrationController.createadminRegistrationService);
router.post('/login', adminRegistrationController.login);
// router
//   .route('/')
//   .get(interviewerRegistrationController.getInterviewerRegistration);
// router
//   .route('/:interviewerRegistrationId')
//   .get(interviewerRegistrationController.getInterviewerRegistrationById)
//   .put(upload.array('uploadResume'), interviewerRegistrationController.updateInterviewerRegistrationById)
//   .delete(interviewerRegistrationController.deleteInterviewerRegistration)

// router.route('/:interviewerRegistrationId/sameData').get(interviewerRegistrationController.getSameInterviewRegistration)
module.exports = router;