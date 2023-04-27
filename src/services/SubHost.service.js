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

module.exports = {
  create_SubHost,
};
