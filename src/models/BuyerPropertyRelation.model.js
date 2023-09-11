const { boolean } = require('joi');
const mongoose = require('mongoose');
const { v4 } = require('uuid');

const BuyerPropertyRelationSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  propertyId: {
    type: String,
  },
  userId: {
    type: String,
  },
  created: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const ViewedDetails = mongoose.model('contactView', BuyerPropertyRelationSchema);

const BuyerPropertyRelationWisheListSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  propertyId: {
    type: String,
  },
  userId: {
    type: String,
  },
  created: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const whishListDetails = mongoose.model('whishList', BuyerPropertyRelationWisheListSchema);

const BuyershortListRelationSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  propertyId: {
    type: String,
  },
  userId: {
    type: String,
  },
  created: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
});
const shortList = mongoose.model('shortList', BuyershortListRelationSchema);

const SellerNotificationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    sellerId: {
      type: String,
    },
    buyerId: {
      type: String,
    },
    postId: {
      type: String,
    },
    type: {
      type: String,
    },
    scheduleDate: {
      type: String,
    },
    scheduleTime: {
      type: String,
    },
    reportId: {
      type: String,
    },
    reportDate_Time: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const SellerNotification = mongoose.model('SellerNotification', SellerNotificationSchema);

module.exports = {
  ViewedDetails,
  whishListDetails,
  shortList,
  SellerNotification,
};
