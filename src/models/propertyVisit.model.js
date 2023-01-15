const mongoose = require('mongoose');
const { v4 } = require('uuid');

const propertVisitSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  userId: {
    type: String,
  },
  propertyId: {
    type: String,
  },
  visitDate_Time: {
    type: Date,
  },
  created: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const PropertyVisit = mongoose.model('propertyvisit', propertVisitSchema);

module.exports = PropertyVisit;
