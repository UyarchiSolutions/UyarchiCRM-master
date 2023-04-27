const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const SubHostSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    Name: {
      type: String,
    },
    email: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    role: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    password: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
//  */
SubHostSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

SubHostSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const SubHost = mongoose.model('subHost', SubHostSchema);

module.exports = SubHost;
