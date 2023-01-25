const express = require('express');
const AmentiesController = require('../../controllers/amenties.controller');
const router = express.Router();

router.route('/').post(AmentiesController.createAmenties).get(AmentiesController.getAllAmenties);
router.route('/:id').get(AmentiesController.getAmentiesById);

module.exports = router;
