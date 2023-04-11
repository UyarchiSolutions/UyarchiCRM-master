const mongoose = require('mongoose');
const { v4 } = require('uuid');

const propertyAlert = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    userId: {
      type: String,
    },
    area: {
      type: Array,
      default: [],
    },
    address: {
      type: String,
    },
    propertyType: {
      type: Array,
      default: [],
    },
    BhkType: {
      type: Array,
      default: [],
    },
    amountFrom: {
      type: Number,
    },
    amountTo: {
      type: Number,
    },
    availability: {
      type: Array,
      default: [],
    },
    parking: {
      type: Array,
      default: [],
    },
    propertyStatus: {
      type: Array,
      default: [],
    },
    shftingDate: {
      type: Array,
      default: [],
    },
    foodType: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const Propalert = mongoose.model('properyalert', propertyAlert);
module.exports = Propalert;
