const mongoose = require('mongoose');
const { v4 } = require('uuid');

const requestStreamSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    planId: {
      type: String,
    },
    streamName: {
      type: String,
    },
    streamingDate: {
      type: String,
    },
    streamingTime: {
      type: String,
    },
    postId: {
      type: String,
    },
    primaryCommunication: {
      type: String,
    },
    secondaryCommunication: {
      type: String,
    },
    description: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    archive: {
      type: Boolean,
      default: false,
    },
    post: {
      type: Array,
    },
    communicationMode: {
      type: Array,
    },
    adminApprove: {
      type: String,
      default: 'Pending',
    },
    activelive: {
      type: String,
    },
    tokenGeneration: {
      type: String,
    },
    goLive: {
      type: Boolean,
      default: true,
    },
    audio: {
      type: Boolean,
      default: true,
    },
    video: {
      type: Boolean,
      default: true,
    },
    allot: {
      type: Boolean,
      default: true,
    },
    videoconvertStatus: {
      type: String,
      default: 'Pending',
    },
    streamingDate_time: {
      type: String,
    },
    chat_need: {
      type: String,
    },
    allot_chat: {
      type: String,
    },
    allot_host_1: {
      type: String,
    },
    sellerId: {
      type: String,
    },
    postCount: {
      type: Number,
    },
    startTime: {
      type: Number,
    },
    DateIso: {
      type: Number,
    },
    Duration: {
      type: Number,
    },
    chat: {
      type: String,
    },
    endTime: {
      type: Number,
    },
    max_post_per_stream: {
      type: Number,
    },
    noOfParticipants: {
      type: Number,
    },
    streamEnd_Time: {
      type: String,
    },
    image: {
      type: String,
    },
    teaser: {
      type: String,
    },
    end_Status: {
      type: String,
    },
    allot_host_2: {
      type: String,
    },
    allot_host_3: {
      type: String,
    },
    status: {
      type: String,
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const RequestStream = mongoose.model('requeststream', requestStreamSchema);

module.exports = RequestStream;
