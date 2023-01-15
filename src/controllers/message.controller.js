const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const moment = require('moment');
const { Messages } = require('../models/message.model');
const messageService = require('../services/message.service');

const createMessage = catchAsync(async (req, res) => {
  let currendDate = moment().format('YYYY-MM-DD');
  const { userId, message, roomId } = req.body;
  let values = { date: currendDate, created: moment(), userId: userId, message: message, roomId: roomId };
  let save = await Messages.create(values);
  await save.save();
  return res.send(save);
});

const getmessages = catchAsync(async (req, res) => {
  let currendDate = moment().format('YYYY-MM-DD');
  let values = await Messages.aggregate([
    {
      $match: { date: currendDate },
    },
    {
      $sort: { created: -1 },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'sender',
        foreignField: '_id',
        as: 'users',
      },
    },
    {
      $unwind: '$users',
    },
    {
      $project: {
        content: 1,
        name: '$users.primaryContactName',
        type: '$users.type',
      },
    },
  ]);
  return res.send(values);
});

const getchtting_message = catchAsync(async (req, res) => {
  const data = await messageService.getchtting_message(req.params.id);
  res.send(data);
});

module.exports = {
  createMessage,
  getmessages,
  getchtting_message,
};
