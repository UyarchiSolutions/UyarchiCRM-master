const express = require('express');
const SubHostController = require('../../controllers/SubHost.controller');
const router = express.Router();
const Authorization = require('../../controllers/BuyerAuth');

router.route('/').post(Authorization, SubHostController.create_SubHost);

module.exports = router;
