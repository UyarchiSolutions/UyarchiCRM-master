const express = require('express');
const supplierController = require('../../controllers/supplier.controller');
const router = express.Router();
router.route('/').post(supplierController.createSupplierService).get(supplierController.getAllSupplierService);
router.route('/allData/:page').get(supplierController.getAllSupplierDeleteService);
router
  .route('/:supplierId')
  .post(supplierController.createSupplierService)
  .get(supplierController.getSupplierByIdService)
  .put(supplierController.updateSupplierByIdService)
  .delete(supplierController.deleteSupplierByIdService);

router.route('/type/getName/:type').get(supplierController.createSupplierwithType);
//login
router.route('/login/data').post(supplierController.login);
router.route('/forgot/password').post(supplierController.forgetPassword);
router.route('/otpVerification/password-change').post(supplierController.otpVerification);
router.route('/updatePassword/afterOtp/:id').put(supplierController.updatePasswordByIdSupplierId);
router.route('/changePassword/data/:supplierId').put(supplierController.changePasswordSupplierByIdService);
router.route('/getbuyer/data/:supplierId/:productId/:page').get(supplierController.getSupplierDetails);
router.route('/getMap/Location').get(supplierController.getMapLocation);
module.exports = router;
