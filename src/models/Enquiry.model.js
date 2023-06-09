const { boolean } = require('joi');
const mongoose = require('mongoose');
const { v4 } = require('uuid');

const EnquireSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    Name: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    Enquiry: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const Enquiery = mongoose.model('enquiry', EnquireSchema);

module.exports = {
  Enquiery,
};
