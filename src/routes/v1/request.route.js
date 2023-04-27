const express = require('express');
const router = express.Router();
const RequestStreamController = require('../../controllers/requestStream.controller');
const Authorization = require('../../controllers/BuyerAuth');

router.route('/').post(Authorization, RequestStreamController.createRequestStream);
router.route('/:id').get(RequestStreamController.getRequsetStreamById);
router.route('/:id').put(RequestStreamController.UpdateRequestStream);
router.route('/get/Streams').get(Authorization, RequestStreamController.getStreams);
router.route('/getStreams/Admin/Side').get(RequestStreamController.getStreams_Admin_Side);
router.route('/AdminStream/Approved/Cancel/:id').put(RequestStreamController.AdminStream_Approved_Cancel);
module.exports = router;
