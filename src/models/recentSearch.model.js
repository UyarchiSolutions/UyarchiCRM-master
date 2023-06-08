const mongoose = require('mongoose');
const { v4 } = require('uuid');

const RecentSearchSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  formatAdd: {
    type: String,
  },
  HouseOrCommercialType: {
    type: String,
  },
  type: {
    type: String,
  },
  area: {
    type: String,
  },
  propertType: {
    type: Array,
  },
  BHKType: {
    type: Array,
  },
  rentDetails: {
    type: Array,
  },
  furnishing: {
    type: Array,
  },
  parking: {
    type: Array,
  },
  rentprefer: {
    type: Array,
  },
  propAge: {
    type: Array,
  },
  bathroom: {
    type: Array,
  },
  buildupfrom: {
    type: Number,
  },
  buildupto: {
    type: Number,
  },
  priceFrom: {
    type: Number,
  },
  priceTo: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
  },
  selected: {
    type: Array,
  },
  userId: {
    type: String,
  },
  floor: {
    type: String,
  },
  routeLink: {
    type: String,
  },
  ageOfBuilding: {
    type: String,
  },
  amenities: {
    type: String,
  },
  buildingType: {
    type: String,
  },
});

const RecentSearch = mongoose.model('RecentSearch', RecentSearchSchema);

module.exports = RecentSearch;
