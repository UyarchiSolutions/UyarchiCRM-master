const { boolean } = require('joi');
const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { create } = require('./supplier.model');

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
    date: {
      type: String,
    },
    Remove: {
      type: String,
    },
    answer: {
      type: String,
    },
    EnquiryId: String,
  },
  { timestamps: true }
);

const Enquiery = mongoose.model('enquiry', EnquireSchema);

const createFAQSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    headingId: {
      type: String,
    },
    Question: {
      type: String,
    },
    Answer: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const FAQ = mongoose.model('faq', createFAQSchema);

const HeadingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    heading: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { new: true }
);
const Heading = mongoose.model('heading', HeadingSchema);

module.exports = {
  Enquiery,
  FAQ,
  Heading,
};
