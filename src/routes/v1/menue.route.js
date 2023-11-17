const express = require('express');
const menueController = require('../../controllers/menue.controller');

const router = express.Router();

router.route('/').post(menueController.createMenues).get(menueController.getAllMenues);
router
  .route('/:menueId')
  .get(menueController.getMenuesById)
  .delete(menueController.deleteMenueById)
  .put(menueController.updateMenuesById);

module.exports = router;
