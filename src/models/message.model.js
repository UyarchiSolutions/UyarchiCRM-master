const mongoose = require('mongoose');
const { v4 } = require('uuid');

const messageSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  userId: {
    type: String,
  },
  message: {
    type: String,
    trime: true,
  },
  roomId: {
    type: String,
  },
  created: {
    type: Date,
  },
  date: {
    type: String,
  },
  socketId: {
    type: String,
  },
});

const Messages = mongoose.model('Message', messageSchema);

module.exports = { Messages };
