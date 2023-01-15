const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const RecipentPayments = require('../models/recipients.Payment.model');
const { Host, HostProduct, HostStreaming } = require('../models/hostreg.model');

const createPayment = async (body, userid) => {
  const { streamingId, paidAmt, Qty, Price } = body;
  console.log(userid);
  let streaming = await HostStreaming.findById(streamingId);
  if (!streaming) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Streaming Not Found');
  }
  let totalStock = parseInt(streaming.stock);
  let availableStock = totalStock - parseInt(Qty);
  console.log(streaming._id, 'asdl;h');
  let values = {
    ...body,
    ...{
      recipientId: userid,
      paidAmt: paidAmt,
      Qty: Qty,
      created: moment(),
      date: moment().format('YYYY-MM-DD'),
      time: moment().format('HH:MM'),
      status: 'Paid',
      streamingId: streaming._id,
    },
  };
  await RecipentPayments.create(values);
  let update = await HostStreaming.findByIdAndUpdate({ _id: streamingId }, { stock: availableStock }, { new: true });

  return update;
};

module.exports = {
  createPayment,
};
