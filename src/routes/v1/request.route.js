const express = require('express');
const router = express.Router();
const RequestStreamController = require('../../controllers/requestStream.controller');

router.route('/').post(RequestStreamController.createRequestStream);
router.route('/:id').get(RequestStreamController.getRequsetStreamById);
router.route('/:id').put(RequestStreamController.UpdateRequestStream);

module.exports = router;
