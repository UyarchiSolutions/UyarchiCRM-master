const mongoose = require('mongoose');
const { v4 } = require('uuid');

const SavedSearchSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  Title: {
    type: String,
  },
  location: {
    type: String,
  },
  BHKType: {
    type: String,
  },
  subType: {
    type: String,
  },
  propertyType: {
    type: String,
  },
  price: {
    type: Number,
  },
  buildingType: {
    type: String,
  },
  furnishingStatus: {
    type: String,
  },
  parkingAvailability: {
    type: String,
  },
  created: {
    type: Date,
  },
  userId: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const SavedSearch = mongoose.model('savedSearch', SavedSearchSchema);

module.exports = SavedSearch;
