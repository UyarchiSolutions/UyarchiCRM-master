const httpStatus = require('http-status');
const { Users } = require('../models/B2Busers.model');
const ApiError = require('../utils/ApiError');



const createUser = async (userBody) => {
  let value = Users.create(userBody);
  return value;
};


const UsersLogin = async (userBody) => {
  const { phoneNumber, password } = userBody;
  let userName = await Users.findOne({ phoneNumber: phoneNumber });
  if (!userName) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Phone Number Not Registered');
  } else {
    if (await userName.isPasswordMatch(password)) {
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Passwoed Doesn't Match");
    }
  }
  return userName;
};


const getAllUsers = async (page) => {
  let values = await Users.aggregate([
    {
      $lookup: {
        from: 'roles',
        localField: 'userRole',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              roleName: 1,
            },
          },
        ],
        as: 'RoleData',
      },
    },
    {
      $unwind: '$RoleData',
    },
    {
      $lookup: {
        from: 'musers',
        localField: '_id',
        foreignField: 'user_id',
        as: 'metadatas',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phoneNumber: 1,
        active: 1,
        salary: 1,
        dateOfJoining: 1,
        stepTwo: 1,
        createdAt: 1,
        userrole: '$RoleData.roleName',
        metavalue: '$metadatas',
      },
    },
    {
      $skip: 10 * page,
    },
    {
      $limit: 10,
    },
  ]);
  let total = await Users.aggregate([
    {
      $lookup: {
        from: 'roles',
        localField: 'userRole',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              roleName: 1,
            },
          },
        ],
        as: 'RoleData',
      },
    },
    {
      $unwind: '$RoleData',
    },
    {
      $lookup: {
        from: 'musers',
        localField: '_id',
        foreignField: 'user_id',
        as: 'metadatas',
      },
    },
  ]);
  return { values: values, total: total.length };
};

module.exports = {
  createUser,
  UsersLogin,
  getAllUsers

};
