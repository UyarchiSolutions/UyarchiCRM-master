const mongoose = require('mongoose');
const { v4 } = require('uuid');

const RecentSearchSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  HouseOrCommercialType: {
    type: String,
  },
  Type: {
    type: String,
  },
  area: {
    type: String,
  },
  propertType: {
    type: String,
  },
  BHKType: {
    type: String,
  },
  MonthlyRentFrom: {
    type: Number,
  },
  MonthlyRentTo: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
  },
  userId: {
    type: String,
  },
});

const RecentSearch = mongoose.model('RecentSearch', RecentSearchSchema);

module.exports = RecentSearch;
