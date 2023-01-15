const express = require('express');
const userPlanController = require('../../controllers/usersPlan.contrller');
const Auth = require('../../controllers/BuyerAuth');
const router = express.Router();

router.route('/').post(Auth, userPlanController.createuserPlan);
router.route('/getLatestUserPlan').get(Auth, userPlanController.getLatestUserPlan);
module.exports = router;
