const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const RolesService = require('../services/roles.sservice');

const createRoles = catchAsync(async (req, res) => {
  const roles = await RolesService.createRoles(req.body);
  if (!roles) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roles Not Fount.');
  }
  res.status(httpStatus.CREATED).send(roles);
});

const getAllRoles = catchAsync(async (req, res) => {
  const role = await RolesService.getAllRoles();
  res.send(role);
});

const mainWarehouseRoles = catchAsync(async (req, res) => {
  const role = await RolesService.mainWarehouseRoles();
  res.send(role);
});

const getRoleById = catchAsync(async (req, res) => {
  const role = await RolesService.getRolesById(req.params.roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roles Not Found');
  }

  res.send(role);
});
const getusermenus = catchAsync(async (req, res) => {
  const role = await RolesService.getRolesById(req.userRole);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roles Not Found');
  }

  res.send(role);
});

const updateRolesById = catchAsync(async (req, res) => {
  const role = await RolesService.updateRolesById(req.params.roleId, req.body.menus);
  res.send(role);
});

const deletRoleById = catchAsync(async (req, res) => {
  await RolesService.deleterolesById(req.params.roleId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getroleWardAdmin = catchAsync(async (req, res) => {
  const role = await RolesService.getroleWardAdmin();
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roles Not Found');
  }
  res.send(role);
});

const getroleWardAdminAsm = catchAsync(async (req, res) => {
  const role = await RolesService.getroleWardAdminAsm();
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roles Not Found');
  }
  res.send(role);
});

const getAlldataSalesManager = catchAsync(async (req, res) => {
  const data = await RolesService.getAlldataSalesManager();
  res.send(data);
});

const getAlldataSalesMan = catchAsync(async (req, res) => {
  const data = await RolesService.getAlldataSalesMan(req.params.page);
  res.send(data);
});

const getSalesMan = catchAsync(async (req, res) => {
  const data = await RolesService.getsalesman();
  res.send(data);
});

const getsalesmanOrder = catchAsync(async (req, res) => {
  const data = await RolesService.getsalesmanOrder();
  res.send(data);
});

const gettelecaller = catchAsync(async (req, res) => {
  const data = await RolesService.gettelecaller();
  res.send(data);
});

const getAllSalesmanShops = catchAsync(async (req, res) => {
  const data = await RolesService.getAllSalesmanShops();
  res.send(data);
});

const notAssignTonneValueSalesmanager = catchAsync(async (req, res) => {
  const data = await RolesService.notAssignTonneValueSalesmanager();
  res.send(data);
});

const getMenu = catchAsync(async (req, res) => {
  const data = await RolesService.getMenu(req.params.id);
  res.send(data);
});
const get_user_menu = catchAsync(async (req, res) => {
  const data = await RolesService.get_user_menu(req.userRole);
  res.send(data);
});
module.exports = {
  createRoles,
  getAllRoles,
  getRoleById,
  mainWarehouseRoles,
  updateRolesById,
  deletRoleById,
  getusermenus,
  getroleWardAdmin,
  getroleWardAdminAsm,
  getAlldataSalesManager,
  getAlldataSalesMan,
  getSalesMan,
  getAllSalesmanShops,
  getMenu,
  notAssignTonneValueSalesmanager,
  get_user_menu,
  getsalesmanOrder,
  gettelecaller,
};
