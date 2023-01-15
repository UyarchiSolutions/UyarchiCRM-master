const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const RecipientsPayment = require('../services/recipients.Payment.service');

const createPayment = catchAsync(async (req, res) => {
  let userid = req.userId;
  const data = await RecipientsPayment.createPayment(req.body, userid);
  res.send(data);
});

module.exports = { createPayment };
