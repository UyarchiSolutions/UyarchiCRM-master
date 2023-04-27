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

const Active_Inactive_SubHost = async (id, body) => {
  const { type } = body;
  let host = await SubHost.findById(id);
  if (!host) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Sub Host Not Available');
  }
  if (type == 'active') {
    host = await SubHost.findByIdAndUpdate({ _id: id }, { active: true }, { new: true });
  } else {
    host = await SubHost.findByIdAndUpdate({ _id: id }, { active: false }, { new: true });
  }
  return host;
};

const updateSubHost = async (id, body) => {
  let host = await SubHost.findById(id);
  if (!host) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Sub Host not Available');
  }
  host = await SubHost.findByIdAndUpdate({ _id: id }, body, { new: true });
  return host;
};

module.exports = {
  create_SubHost,
  get_created_Subhost_By_Seller,
  Active_Inactive_SubHost,
  updateSubHost,
};
