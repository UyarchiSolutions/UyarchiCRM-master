const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const RecipentOrdes = require('../models/recipient.orders.model');

const createRecipientsOrders = async (body) => {
  let values = { ...body, ...{ created: moment(), date: moment().format('YYYY-MM-DD'), time: moment().format('HH:MM a') } };
  const create = await RecipentOrdes.create(values);
  return create;
};

const getRecipientOrdered_data = async (streamingId, userid) => {
  let values = await RecipentOrdes.findOne({ streamingId: streamingId, RecipentId: userid });
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Orderd not Found');
  }
  return values;
};

const deleteOrder = async (streamingId, body) => {
  let data = await RecipentOrdes.findOne({streamingId:streamingId, RecipentId:body.RecipentId})
  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, 'Orderd not Found');
  }
  let values = await RecipentOrdes.findOneAndDelete({ streamingId: streamingId, RecipentId: body.RecipentId });
  return values;
};

const getRecipientOrdered_data_Delete = async (userid) => {
  let values = await RecipentOrdes.deleteOne({RecipentId: userid });
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Orderd not Found');
  }

  return values;
};

module.exports = { createRecipientsOrders, getRecipientOrdered_data, getRecipientOrdered_data_Delete, deleteOrder};
