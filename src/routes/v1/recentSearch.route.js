const express = require('express');
const RecentSearchController = require('../../controllers/recentSearch.controller');
const router = express.Router();
const Auth = require('../../controllers/BuyerAuth');

router.route('/').post(Auth, RecentSearchController.createRcentSearch);

module.exports = router;
