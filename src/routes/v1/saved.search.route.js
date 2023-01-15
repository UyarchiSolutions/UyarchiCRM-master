const express = require('express');
const router = express.Router();
const SavedSearchController = require('../../controllers/saved.search.controller');
const Auth = require('../../controllers/BuyerAuth');

router.route('/').post(Auth, SavedSearchController.CreateSavedSearch);
router.route('/SavedSearch').get(Auth, SavedSearchController.getSavedSearch);
router.route('/:id').get(SavedSearchController.getSavedSearchById);
module.exports = router;
