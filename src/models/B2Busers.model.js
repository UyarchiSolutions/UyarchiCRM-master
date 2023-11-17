const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { v4 } = require('uuid');

const B2BusersSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    name: {
      type: String,
      // required: true,
      trim: true,
    },
    dateOfJoining: {
      type: String,
    },
    salary: {
      type: Number,
    },
    email: {
      type: String,
      // required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String, // used by the toJSON plugin
    },
    stepTwo: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    userRole: {
      type: String,
    },
    OTP: {
      type: Number,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    salesManagerStatus: {
      type: String,
    },
    salesManStatus: {
      type: String,
    },
    telecallerStatus: {
      type: String,
    },
    salesmanOrderStatus: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
B2BusersSchema.plugin(toJSON);
B2BusersSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
B2BusersSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
B2BusersSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

B2BusersSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const Users = mongoose.model('B2BUsers', B2BusersSchema);

const usermetaSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  user_id: {
    type: String,
  },
  metaKey: {
    type: String,
  },
  metavalue: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
});

const metaUsers = mongoose.model('MetaUsers', usermetaSchema);

module.exports = { Users, metaUsers };
