const mongoose = require('mongoose');
const { v4 } = require('uuid');
const bcrypt = require('bcryptjs');

const AdminPlanSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  planName: {
    type: String,
  },
  PostNumber: {
    type: Number,
  },
  PlanValidate: {
    type: Number,
  },
  Videos: {
    type: Number,
  },
  Amount: {
    type: Number,
  },
  Type: {
    type: String,
  },
  offer: {
    type: String,
  },
  PlanRole: {
    type: String,
  },
  postValidate: {
    type: Number,
  },
  description: {
    type: String,
  },
  images: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: true,
  },
  ContactNumber: {
    type: Number,
  },
  created: {
    type: Date,
  },
});

const AdminPlan = mongoose.model('AdminPlan', AdminPlanSchema);

module.exports = AdminPlan;
