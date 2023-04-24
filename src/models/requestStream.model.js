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
    streamDate: {
      type: String,
    },
    streamTime: {
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
  },
  {
    timestamps: true,
  }
);

const RequestStream = mongoose.model('requeststream', requestStreamSchema);

module.exports = RequestStream;
