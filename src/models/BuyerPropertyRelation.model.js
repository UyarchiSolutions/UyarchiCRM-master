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

module.exports = {
  ViewedDetails,
  whishListDetails,
};
