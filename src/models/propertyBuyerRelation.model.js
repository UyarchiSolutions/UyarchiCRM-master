const mongoose = require('mongoose');
const { v4 } = require('uuid');

const PropertyBuyerRelataionSchema = new mongoose.Schema({
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
  history: {
    type: Array,
  },
  status: {
    type: String,
  },
  created: {
    type: Date,
  },
  intrestedDate: {
    type: Date,
  },
  scheduleDate: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const PropertyBuyerRelataion = mongoose.model('properBuyerrelation', PropertyBuyerRelataionSchema);

module.exports = PropertyBuyerRelataion;
