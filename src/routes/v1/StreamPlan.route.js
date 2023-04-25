const express = require('express');
const StreamPlanController = require('../../controllers/StreamPlan.controller');
const router = express.Router();
const Authorization = require('../../controllers/BuyerAuth');

router.route('/').post(StreamPlanController.Creact_Stream_Plan).get(StreamPlanController.getActive_Planes);
router.route('/:id').get(StreamPlanController.get_Stream_Plan_ById);
router.route('/update/stream/plab/:id').put(StreamPlanController.update_StreamPlan);
router.route('/active/inactive/:id').put(StreamPlanController.Active_Inactive);
router.route('/fetch/StreamPlanes/:page/:range').get(StreamPlanController.fetch_Stream_Planes);
// Purchased Plan

router.route('/purchase/plan').post(Authorization, StreamPlanController.Purchase_plan);
router.route('/getPurchased/Planes').get(Authorization, StreamPlanController.getPurchased_Planes);

module.exports = router;
