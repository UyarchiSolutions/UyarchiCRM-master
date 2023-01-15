const express = require('express');
const supplierAppUserController = require('../../controllers/supplierAppUser.controller');
const router = express.Router();

router.route('/').post(supplierAppUserController.createsupplierAppUserService);
router.route('/').get(supplierAppUserController.getsupplierAppUserServiceAll);
router.route('/login').post(supplierAppUserController.login);
router
  .route('/:supplierAppUserId')
  .get(supplierAppUserController.getsupplierAppUserServiceById)
  .put(supplierAppUserController.updateSupplierAppUserService)
  .delete(supplierAppUserController.deleteSupplierAppUserService);

router.route('/responce/:id').get(supplierAppUserController.getsupplierAppUserServiceByIdAll)
router.route('/responceAll/all').get(supplierAppUserController.getsupplierAppUserServiceByIdAllNotId)
module.exports = router;