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
    },
    address: {
      type: String,
    },
    propertyType: {
      type: Array,
    },
    BhkType: {
      type: Array,
    },
    amountFrom: {
      type: Number,
    },
    amountTo: {
      type: Number,
    },
    availability: {
      type: Array,
    },
    parking: {
      type: Array,
    },
    propertyStatus: {
      type: Array,
    },
    shftingDate: {
      type: Array,
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
