const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const RequestStream = require('../models/requestStream.model');
const { StreamPlan, PurchasePlan } = require('../models/StreamPlan.model');

// create Request Stream

const createRequestStream = async (body, userId) => {
  const { planId, hour, minute, timeMode, streamingDate } = body;
  if (timeMode == 'PM') {
    hour + 12;
  }
  let time = `${hour}:${minute}:00`;
  console.log(time);
  const dateTime = new Date().setTime(new Date(`${streamingDate}T${time}`).getTime());
  const isoDateTime = moment(dateTime).format('YYYY-MM-DDTHH:mm:ss.sssZ');
  let startTime = dateTime;
  console.log(startTime);
  let planes = await PurchasePlan.findById(planId);
  if (!planes) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Not Available');
  }
  let endTimes = planes.Duration_per_stream;
  let datess = new Date().setTime(new Date(`${streamingDate}T${time}`).getTime() + endTimes * 60 * 1000);
  let datas = {
    ...body,
    ...{
      streamingTime: startTime,
      startTime: startTime,
      endTime: datess,
      streamingDate_time: isoDateTime,
      sellerId: userId,
      chat_need: planes.Chat_Needed,
      noOfParticipants: parseInt(planes.No_of_participants_Limit),
      max_post_per_stream: parseInt(planes.no_of_host_per_Stream),
      Duration: parseInt(planes.Duration_per_stream),
    },
  };
  let stream = parseInt(planes.no_of_Stream) - 1;
  planes = await PurchasePlan.findById({ _id: planes._id }, { no_of_Stream: stream }, { new: true });
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
