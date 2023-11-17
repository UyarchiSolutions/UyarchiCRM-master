const express = require('express');
const roleController = require('../../controllers/roles.controller');
const authorization = require('../../controllers/token.verify.controller');

const router = express.Router();
router.route('/usermenus').get(authorization, roleController.getusermenus);
router.route('/').post(roleController.createRoles).get(roleController.getAllRoles);
router
  .route('/:roleId')
  .get(roleController.getRoleById)
  .delete(roleController.deletRoleById)
  .put(roleController.updateRolesById);
router.route('/admin/wh').get(roleController.mainWarehouseRoles);
router.route('/getallwardadmin/data').get(roleController.getroleWardAdmin);
router.route('/getallwardadminAsm/Asm').get(roleController.getroleWardAdminAsm);
router.route('/getAllSalesManager/data').get(roleController.getAlldataSalesManager);
router.route('/getAllSalesMan/data/:page').get(roleController.getAlldataSalesMan);
router.route('/getSalesMan/data').get(roleController.getSalesMan);
router.route('/gettelecaller/data').get(roleController.gettelecaller);
router.route('/getsalesmanOrder/data').get(roleController.getsalesmanOrder);
router.route('/getAllSalesmanShops/data').get(roleController.getAllSalesmanShops);
router.route('/notAssignTonneValueSalesmanager/data').get(roleController.notAssignTonneValueSalesmanager);
router.route('/getMenues/:id').get(roleController.getMenu);
router.route('/get_user/munus/').get(authorization, roleController.get_user_menu);
module.exports = router;
