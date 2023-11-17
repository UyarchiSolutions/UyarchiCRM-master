const catchAsync = require('../utils/catchAsync');
const b2bUsersService = require('../services/B2BUsers.service');
const tokenService = require('../services/token.service');

const httpStatus = require('http-status');
const createB2bUsers = catchAsync(async (req, res) => {
  const users = await b2bUsersService.createUser(req.body);
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, 'users Not Fount');
  }
  res.status(httpStatus.CREATED).send(users);
});


const B2bUsersLogin = catchAsync(async (req, res) => {
  const users = await b2bUsersService.UsersLogin(req.body);
  const tokens = await tokenService.generateAuthTokens(users);
  res.send({ users, tokens });
});


const getAllUsers = catchAsync(async (req, res) => {
  const user = await b2bUsersService.getAllUsers(req.params.page);
  res.send(user);
});


module.exports = {
  createB2bUsers,
  B2bUsersLogin,
  getAllUsers

};
