const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const RequestStream = require('../models/requestStream.model');
const { StreamPlan } = require('../models/StreamPlan.model');
const { Stream } = require('winston/lib/winston/transports');
// create Request Stream

const createRequestStream = async (body, userId) => {
  const { planId, hour, minute, timeMode, streamingDate } = body;
  if (timeMode == 'PM') {
    hour + 12;
  }
  let time = `${hour}:${minute}`;
  let startTime = new Date(new Date(streamingDate + ' ' + time)).getTime();
  let planes = await StreamPlan.findById(planId);
  if (!planes) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Not Available');
  }
  let endTimes = planes.Duration_per_stream;
  let datess = new Date().setTime(new Date(startTime).getTime() + endTimes * 60 * 1000);
  let datas = {
    ...body,
    ...{
      streamingTime: startTime,
      startTime: startTime,
      endTime: datess,
      streamingDate_time: `${streamingDate} ${hour}:${minute}`,
      sellerId: userId,
      chat_need: planes.Chat_Needed,
      noOfParticipants: parseInt(planes.No_of_participants_Limit),
      max_post_per_stream: parseInt(planes.no_of_host_per_Stream),
      Duration: planes.parseInt(planesDuration_per_stream),
    },
  };
  let stream = parseInt(planes.no_of_Stream) - 1;
  planes = await StreamPlan.findById({ _id: id }, { no_of_Stream: stream }, { new: true });
  let data = await RequestStream.create(datas);
  return data;
};

// Fetch request Stream By Id

const getRequsetStreamById = async (id) => {
  let data = await RequestStream.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Requset Stream Not Found');
  }
  return data;
};

// update Request stream
const UpdateRequestStream = async (id, body) => {
  let data = await RequestStream.findById(id);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Request Stream Not Found');
  }
  data = await RequestStream.findByIdAndUpdate({ _id: id }, { body }, { new: true });
  return data;
};

module.exports = {
  createRequestStream,
  getRequsetStreamById,
  UpdateRequestStream,
};