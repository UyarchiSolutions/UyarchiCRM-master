const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const RequestStream = require('../models/requestStream.model');
const { StreamPlan, PurchasePlan } = require('../models/StreamPlan.model');

// create Request Stream

const createRequestStream = async (body, userId) => {
  let { planId, hour, minute, timeMode, streamingDate } = body;
  if (timeMode == 'PM') {
    let time = parseInt(hour) + 12;
    hour = time.toString();
  }
  let time = `${hour}:${minute}:00`;
  console.log(time);
  const dateTime = new Date().setTime(new Date(`${streamingDate}T${time}`).getTime());
  const isoDateTime = moment(dateTime).format('YYYY-MM-DDTHH:mm:ss.sssZ');
  const isoTime = moment(dateTime).format('HH:mm');
  let startTime = dateTime;
  let planes = await PurchasePlan.findOne({ planId: planId });
  if (!planes) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Plan Not Available');
  }
  let endTimes = planes.Duration_per_stream;
  let datess = new Date().setTime(new Date(`${streamingDate}T${time}`).getTime() + endTimes * 60 * 1000);
  console.log(startTime);
  const datecheck = new Date(dateTime);
  const dateTimeString = datecheck.toLocaleString(); // Convert to local date and time string
  console.log(dateTimeString, 'plan', endTimes);
  const isoendTime = moment(dateTime).add(endTimes, 'days').format('YYYY-MM-DDTHH:mm:ss.sssZ');

  let datas = {
    ...body,
    ...{
      streamingTime: isoTime,
      startTime: startTime,
      endTime: datess,
      streamEnd_Time: isoendTime,
      streamingDate_time: isoDateTime,
      sellerId: userId,
      chat_need: planes.Chat_Needed,
      noOfParticipants: parseInt(planes.No_of_participants_Limit),
      max_post_per_stream: parseInt(planes.no_of_host_per_Stream),
      Duration: parseInt(planes.Duration_per_stream),
    },
  };
  let stream = parseInt(planes.availableStream) - 1;
  if (stream == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Given Stream Completed Please Purchase New Stream OR Extend this Stream');
  }
  await PurchasePlan.findByIdAndUpdate({ _id: planId }, { availableStream: stream.toString() }, { new: true });
  let data = await RequestStream.create(datas);
  return data;
  // return { message: 'Under Working......' };
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
  data = await RequestStream.findByIdAndUpdate({ _id: id }, body, { new: true });
  return data;
};

const getStreams = async (userId) => {
  const values = await RequestStream.aggregate([
    {
      $match: {
        sellerId: userId,
      },
    },
    {
      $lookup: {
        from: 'sellerposts',
        localField: 'postId',
        foreignField: '_id',
        as: 'posts',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$posts',
      },
    },
  ]);
  return values;
};

const getStreams_Admin_Side = async () => {
  let values = await RequestStream.aggregate([
    {
      $lookup: {
        from: 'sellerposts',
        localField: 'postId',
        foreignField: '_id',
        as: 'posts',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$posts',
      },
    },
  ]);
  return values;
};

const AdminStream_Approved_Cancel = async (id, body) => {
  let values = await RequestStream.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Stream Not Available');
  }
  if (body.type == 'approve') {
    values = await RequestStream.findByIdAndUpdate({ _id: id }, { adminApprove: 'Approved' }, { new: true });
  } else {
    values = await RequestStream.findByIdAndUpdate({ _id: id }, { adminApprove: 'Cancelled' }, { new: true });
  }
  return values;
};

const getStreamById = async (id) => {
  let values = await RequestStream.aggregate([
    {
      $match: {
        _id: id,
      },
    },
    {
      $lookup: {
        from: 'sellerposts',
        localField: 'postId',
        foreignField: '_id',
        as: 'posts',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$posts',
      },
    },
    {
      $lookup: {
        from: 'buyers',
        localField: 'sellerId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$user',
      },
    },
  ]);
  return values;
};

const getApprovedStream_For_Buyers = async () => {
  let values = await RequestStream.aggregate([
    {
      $match: {
        adminApprove: 'Approved',
        active: true,
      },
    },
  ]);
  return values;
};

const CancelStreamById = async (id) => {
  let stream = await RequestStream.findById(id);
  if (!stream) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Stream Not Available');
  }
  stream = await RequestStream.findOneAndUpdate({ _id: id }, { status: 'Cancelled' }, { new: true });
  return stream;
};

module.exports = {
  createRequestStream,
  getRequsetStreamById,
  UpdateRequestStream,
  getStreams,
  getStreams_Admin_Side,
  AdminStream_Approved_Cancel,
  getStreamById,
  getApprovedStream_For_Buyers,
  CancelStreamById,
};
