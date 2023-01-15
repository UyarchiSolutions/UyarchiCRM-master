const mongoose = require('mongoose');
const { v4 } = require('uuid');

// create chat schema with users Id's

const ChatSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  users: [
    {
      type: String,
      ref: 'suppler',
    },
  ],
  lastMessage: {
    type: String,
  },
  usertype: {
    type: String,
  },
  created: {
    type: Date,
  },
});

const Chat = mongoose.model('chat', ChatSchema);

module.exports = Chat;
