const express = require('express');
const RecentSearchController = require('../../controllers/recentSearch.controller');
const router = express.Router();
const Auth = require('../../controllers/BuyerAuth');

router.route('/').post(Auth, RecentSearchController.createRcentSearch);
router.route('/Recentlysearched').get(Auth, RecentSearchController.getRecentlysearched);
router.route('/:id').get(RecentSearchController.getRecentlysearchedById);
module.exports = router;
