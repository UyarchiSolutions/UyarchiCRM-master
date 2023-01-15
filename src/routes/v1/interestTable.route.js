const express = require('express');
const interestController = require('../../controllers/interestTable.controller');
const router = express.Router();
router.route('/').post(interestController.createinterestService).get(interestController.getinterestServiceAll)
router
  .route('/:interestId')
  .get(interestController.getinterestServiceById)
  .put(interestController.updateinterestService)
  .delete(interestController.deleteinterestService);

module.exports = router;