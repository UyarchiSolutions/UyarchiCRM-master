const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { v4 } = require('uuid');

const { toJSON, paginate } = require('./plugins');

const liveStreamSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  token: {
    type: String,
    default: v4,
  },
  token: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: Number,
  },
  expiry: {
    type: Boolean,
    default: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
  },
  streaming: {
    type: String,
  },
  requirementId: {
    type: String,
  },
  adminAprove: {
    type: String,
    default: 'Pending',
  },
  reason: {
    type: String,
  },
  confirm: {
    type: Array,
  },
  rejectDate: {
    type: String,
  },
  rejectTime: {
    type: Number,
  },
  active_Buyer: {
    type: Array,
    default: [],
  },
  expectedQnty: {
    type: Number,
  },
  liveConfirm: {
    type: Boolean,
    default: false,
  },
});
const liveStream = mongoose.model('liveStream', liveStreamSchema);
module.exports = liveStream;
