const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');

const StreamPlanSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    userType: {
      type: String,
    },
    planeName: {
      type: String,
    },
    planType: {
      type: String,
    },
    planMode: {
      type: String,
    },
    no_of_Stream: {
      type: String,
    },
    no_of_host_per_Stream: {
      type: String,
    },
    Duration_per_stream: {
      type: String,
    },
    Duration_per_streamIso: {
      type: Date,
    },
    Entry_Permit_to_participants: {
      type: String,
    },
    No_buyer_contact_Reveals: {
      type: String,
    },
    No_of_participants_Limit: {
      type: String,
    },
    validity_of_plan: {
      type: String,
    },
    validity_of_plan_Iso: {
      type: Date,
    },
    Stream_validity: {
      type: String,
    },
    Stream_validity_Iso: {
      type: Date,
    },
    Regular_Price: {
      type: Number,
    },
    Offer_Price: {
      type: Number,
    },
    Chat_Needed: {
      type: String,
    },
    post_Stream: {
      type: String,
    },
    service_Charges: {
      type: String,
    },
    Description: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const StreamPlane = mongoose.model('StreamPlane', StreamPlanSchema);

module.exports = StreamPlane;
