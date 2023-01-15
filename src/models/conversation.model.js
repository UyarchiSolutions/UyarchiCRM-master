const mongoose = require('mongoose');
const { v4 } = require('uuid');

const conversationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const conversation = mongoose.model('Conversation', conversationSchema);

module.exports = conversation;
