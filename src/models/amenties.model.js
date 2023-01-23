const mongoose = require('mongoose');
const { v4 } = require('uuid');

const AmentiesSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  Society_Amenties: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
  },
});

const Amenties = mongoose.model('amenties', AmentiesSchema);

module.exports = Amenties;
