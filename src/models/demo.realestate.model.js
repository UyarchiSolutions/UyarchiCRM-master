const mongoose = require('mongoose');
const { v4 } = require('uuid');

const DemoPostSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    newsPaper: {
      type: String,
    },
    Edition: {
      type: String,
    },
    dateOfAd: {
      type: String,
    },
    postType: {
      type: String,
    },
    category: {
      type: String,
    },
    propertyType: {
      type: String,
    },
    ageOfProperty: {
      type: String,
    },
    priceExp: {
      type: Number,
    },
    location: {
      type: String,
    },
    tenantType: {
      type: String,
    },
    furnitionStatus: {
      type: String,
    },
    image: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: String,
    },
    finish: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
    },
    Description: {
      type: String,
    },
    imageArr: {
      type: Array,
    },
    bhkBuilding: {
      type: String,
    },
    status: {
      type: String,
      default: 'Pending',
    },
    linkstatus: {
      type: String,
      default: 'Pending',
    },
    otp_verifiyed: {
      type: String,
    },
    streamDate: {
      type: String,
    },
    streamStart: {
      type: Number,
    },
    actualEnd: {
      type: Number,
    },
    streamEnd: {
      type: Number,
    },
    runningStream: {
      type: String,
    },
    sqft: {
      type: String,
    },
  },
  { timestamps: true }
);

const DemoPost = mongoose.model('DemoPost', DemoPostSchema);

const DemoUserSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    userName: {
      type: String,
    },
    mail: {
      type: String,
    },
    mobileNumber: {
      type: Number,
    },
    location: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const DemoUser = mongoose.model('DemoUser', DemoUserSchema);

const Demobuyerschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
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
  phoneNumber: {
    type: Number,
  },
  name: {
    type: String,
  },
  type: {
    type: String,
  },
});

const Demobuyer = mongoose.model('demobuyer', Demobuyerschema);

const Demostreamchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
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
  expirationTimestamp: {
    type: Number,
  },
  streamID: {
    type: String,
  },
  type: {
    type: String,
  },
  uid: {
    type: Number,
  },
  token: {
    type: String,
  },
  channel: {
    type: String,
  },
  userID: {
    type: String,
  },
  status: {
    type: String,
  },
  golive: {
    type: Boolean,
    default: false,
  },
  usertype: {
    type: String,
  },
  live: {
    type: Boolean,
    default: false,
  },
  demoPost: {
    type: String,
  },
});

const DemostreamToken = mongoose.model('demostreamtoken', Demostreamchema);

const demointrestedschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  DateIso: {
    type: Number,
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
  streamHis: {
    type: String,
  },
  streamID: {
    type: String,
  },
  userID: {
    type: String,
  },
  joinedUSER: {
    type: String,
  },
  intrested: {
    type: Boolean,
  },
});
const DemoInstested = mongoose.model('demointrested', demointrestedschema);

const demootp = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  DateIso: {
    type: Number,
  },
  date: {
    type: String,
  },
  created: {
    type: Date,
  },
  mobile: {
    type: Number,
  },
  streamID: {
    type: String,
  },
  userID: {
    type: String,
  },
  OTP: {
    type: Number,
  },
  verify: {
    type: Boolean,
    default: true,
  },
  expired: {
    type: Boolean,
    default: true,
  },
  otpExpiedTime: {
    type: Number,
  },
});
const Demootpverify = mongoose.model('demootp', demootp);

const democloud_record = mongoose.Schema({
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
  videoLink_obj: {
    type: Array,
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
    default: false,
  },
  bigSize: {
    type: Boolean,
    default: false,
  },
  convertedVideo: {
    type: String,
    default: 'Pending',
  },
  convertStatus: {
    type: String,
    default: 'Pending',
  },
});

const Democloudrecord = mongoose.model('democloundrecord', democloud_record);

const mutibleDemoschema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    status: {
      type: String,
      default: 'Pending',
    },
    streamId: {
      type: String,
    },
    agoraAppId: {
      type: String,
    },
    start: {
      type: Number,
    },
    end: {
      type: Number,
    },
    actualEnd: {
      type: Number,
    },
  },
  { timestamps: true }
);

const MutibleDemo = mongoose.model('demostreamhis', mutibleDemoschema);

module.exports = {
  DemoPost,
  DemoUser,
  Demobuyer,
  DemostreamToken,
  DemoInstested,
  Demootpverify,
  Democloudrecord,
  MutibleDemo,
};
