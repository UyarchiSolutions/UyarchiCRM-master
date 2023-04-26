const express = require('express');
const router = express.Router();
const RequestStreamController = require('../../controllers/requestStream.controller');
const Authorization = require('../../controllers/BuyerAuth');

router.route('/').post(Authorization, RequestStreamController.createRequestStream);
router.route('/:id').get(RequestStreamController.getRequsetStreamById);
router.route('/:id').put(RequestStreamController.UpdateRequestStream);

module.exports = router;
