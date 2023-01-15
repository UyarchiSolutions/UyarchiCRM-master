const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const RecipentOrdersService = require('../services/recipients.orders.service');

const createRecipientsOrders = catchAsync(async (req, res) => {
  const data = await RecipentOrdersService.createRecipientsOrders(req.body);
  res.send(data);
});

const getRecipientOrdered_data = catchAsync(async (req, res) => {
  let userid = req.userId;
  console.log(userid)
  const data = await RecipentOrdersService.getRecipientOrdered_data(req.params.id, userid);
  res.send(data);
});

const deleteOrder = catchAsync(async (req, res) => {
  const data = await RecipentOrdersService.deleteOrder(req.params.id, req.body);
  res.send(data);
});

const getRecipientOrdered_data_delete = catchAsync(async (req, res) => {
  let userid = req.userId;
  console.log(userid)
  const data = await RecipentOrdersService.getRecipientOrdered_data_Delete(userid);
  res.send(data);
});

module.exports = {
  createRecipientsOrders,
  getRecipientOrdered_data,
  getRecipientOrdered_data_delete,
  deleteOrder,
};
