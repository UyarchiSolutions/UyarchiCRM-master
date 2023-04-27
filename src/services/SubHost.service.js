const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const SubHost = require('../models/SubHost.model');
const moment = require('moment');

// create SubHost

const create_SubHost = async (body, userId) => {
  let datas = { ...body, ...{ createdBy: userId } };
  let values = await SubHost.create(datas);
  return values;
};

const get_created_Subhost_By_Seller = async (id) => {
  let values = await SubHost.aggregate([
    {
      $match: {
        createdBy: id,
      },
    },
  ]);
  return values;
};

module.exports = {
  create_SubHost,
  get_created_Subhost_By_Seller,
};
