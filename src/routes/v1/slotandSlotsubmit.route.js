const express = require('express');
const slotSubmitController = require('../../controllers/slotandSlotsubmit.controller');
const router = express.Router();

router.route('/').post(slotSubmitController.createslotService);
router.route('/slotSubmit').post(slotSubmitController.createslotSubmitService);
router.route('/').get(slotSubmitController.getslotServiceAll);
router.route('/slotSubmit').get(slotSubmitController.getslotSubmitServiceAll);
router
  .route('/:slotId')
  .get(slotSubmitController.getslotServiceById)
  .put(slotSubmitController.updateslotService)
  .delete(slotSubmitController.deleteslotService);

router
  .route('/slotSubmit/:slotSubmitId')
  .get(slotSubmitController.getslotSubmitServiceById)
  .put(slotSubmitController.updateslotSubmitService)
  .delete(slotSubmitController.deleteslotSubmitService);

module.exports = router;