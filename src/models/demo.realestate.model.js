const mongoose = require('mongoose');
const { v4 } = require('uuid');

const DemoPostSchema = new mongoose.Schema(
  {
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
    }

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
      type: String,
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

module.exports = {
  DemoPost,
  DemoUser,
};
