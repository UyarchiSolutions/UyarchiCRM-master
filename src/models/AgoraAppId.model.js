const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { timeStamp } = require('console');

const agoraAppIdschema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    active: {
      type: Boolean,
      default: true,
    },
    dateISO: {
      type: Number,
    },
    date: {
      type: Number,
    },
    expired: {
      type: Boolean,
      default: false,
    },
    appID: {
      type: String,
    },
    Authorization: {
      type: String,
    },
    cloud_KEY: {
      type: String,
    },
    cloud_secret: {
      type: String,
    },
    appCertificate: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    userId: {
      type: String,
    },
    agorapassword: {
      type: String,
    },
    userMinutes: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: 'demo',
    },
    verifyStatus: {
      type: String,
      default: 'pending',
    },
    verifiedBy: {
      type: String,
    },
    verifiedTime: {
      type: Number,
    },
  },
  { timeStamp: true }
);

const AgoraAppId = mongoose.model('AgoraAppId', agoraAppIdschema);

const UsageAppIDschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  dateISO: {
    type: Number,
  },
  date: {
    type: String,
  },
  expired: {
    type: Boolean,
    default: false,
  },
  appID: {
    type: String,
  },
  streamID: {
    type: String,
  },
  minutes: {
    type: Number,
  },
  streamType: {
    type: String,
  },
});

const UsageAppID = mongoose.model('appidusage', UsageAppIDschema);

const TestAgoraschema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    dateISO: {
      type: Number,
    },
    testToken: {
      type: String,
    },
    status: {
      type: String,
      default: 'pending',
    },
    testUD: {
      type: Number,
    },
    cloud_testToken: {
      type: String,
    },
    cloud_testUD: {
      type: Number,
    },
    endTime: {
      type: Number,
    },
    completed: {
      type: String,
    },
    recordLink: {
      type: String,
    },
    recordLink_mp4: {
      type: String,
    },
    recordLinks: {
      type: Array,
    },
    resourceId: {
      type: String,
    },
    sid: {
      type: String,
    },
    tokenId: {
      type: String,
    },
    test_by: {
      type: String,
    },
    store: {
      type: String,
    },
  },
  { timestamps: true }
);

const TestAgora = mongoose.model('testagoraappid', TestAgoraschema);
module.exports = { AgoraAppId, UsageAppID, TestAgora };
