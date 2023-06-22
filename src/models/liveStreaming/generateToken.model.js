const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('../plugins');
const { roles } = require('../../config/roles');
const { StringDecoder } = require('string_decoder');
const { v4 } = require('uuid');

const tempToken = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  token: {
    type: String,
  },
  date: {
    type: String,
  },
  created: {
    type: Date,
  },
  time: {
    type: Number,
  },
  expDate: {
    type: Number,
  },
  created_num: {
    type: Number,
  },
  participents: {
    type: Number,
  },
  chennel: {
    type: String,
  },
  Uid: {
    type: Number,
  },
  type: {
    type: String,
  },
  hostId: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  cloud_recording: {
    type: String,
  },
  uid_cloud: {
    type: Number,
  },
  cloud_id: {
    type: String,
  },
  store: {
    type: String,
  },
  supplierId: {
    type: String,
  },
  streamId: {
    type: String,
  },
  shopId: {
    type: String,
  },
  Duration: {
    type: Number,
  },
  joinedUser: {
    type: String,
  },
  resourceId: {
    type: String,
  },
  sid: {
    type: String,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  videoLink: {
    type: String,
  },
  recoredStart: {
    type: String,
    default: 'Pending',
  },
  video: {
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
  allMedia: {
    type: Boolean,
    default: true,
  },
  mainhostLeave: {
    type: Boolean,
    default: false
  },
  bigSize: {
    type: Boolean,
    default: false
  },
  convertedVideo: {
    type: String,
    default: 'Pending',
  },
  convertStatus: {
    type: String,
    default: 'Pending',
  }
});

const tempTokenModel = mongoose.model('tempToken', tempToken);

const joinedusers = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
  },
  DateIso: {
    type: Number,
  },
  token: {
    type: String,
  },
  shopId: {
    type: String,
  },
  streamId: {
    type: String,
  },
  hostId: {
    type: String,
  },
  latestedToken: {
    type: String,
  },
  status: {
    type: String,
    default: 'Pending',
  },
  joindedUserBan: {
    type: Boolean,
    default: false
  }
});

const Joinusers = mongoose.model('joinedusers', joinedusers);

module.exports = { tempTokenModel, Joinusers };
