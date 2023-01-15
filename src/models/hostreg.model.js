const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const moment = require('moment');
const { v4 } = require('uuid');
let serverdate = moment().format('yyy-MM-DD');
let time = moment().format('hh:mm a');
const hostSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    },
  },
  mobileNumber: {
    type: Number,
    unique: true,
  },
  category: {
    type: String,
  },
  Address: {
    type: String,
  },
  image: {
    type: String,
  },
  hostId:{
    type:String,
  },
  date: {
    type: String,
    default: serverdate,
  },
  time: {
    type: String,
    default: time,
  },
});

// add plugin that converts mongoose to json
// userSchema.plugin(toJSON);
// userSchema.plugin(paginate);

/**
 * Check if email is taken
//  * @param {string} email - The user's email
//  * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
//  * @returns {Promise<boolean>}
 */
hostSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
//  */
// userSchema.methods.isPasswordMatch = async function (password) {
//   const user = this;
//   return bcrypt.compare(password, user.password);
// };

// userSchema.pre('save', async function (next) {
//   const user = this;
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });

/**
 * @typedef User
 */
const Host = mongoose.model('Host', hostSchema);
const hostProductSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    product: {
      type: String,
    },
    descpition: {
      type: String,
    },
    priceperKg: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    quantityRangeMax:{
      type:Number,
    },
    quantityRangeMin:{
      type:Number,
    },
    productPriceMin:{
      type:Number,
    },
    productPriceMax:{
      type:Number,
    },
    deliveryLocation:{
      type:String,
    },
    deliveryDate:{
      type:String,
    },
    deliveryTime:{
      type:String,
    },
    uid: {
      type: String,
    },
    image: {
      type: String,
    },
    date: {
      type: String,
      default: serverdate,
    },
    time: {
      type: String,
      default: time,
    },
  },
  {
    timestamps: true,
  }
);

const HostProduct = mongoose.model('hostProduct', hostProductSchema);
const hostStreamingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    selectHost: {
      type: String,
    },
    selectProduct: {
      type: String,
    },
    stremingDate: {
      type: String,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    participantAllowed: {
      type: String,
    },
    allowChat: {
      type: String,
    },
    token: {
      type: String,
    },
    date: {
      type: String,
      default: serverdate,
    },
    time: {
      type: String,
      default: time,
    },
    priceperKg: {
      type: Number,
    },
    recipient:{
      type:Array,
      default: [],
    },
    stock: {
      type: Number,
    },
    liveStatus: {
      type: String,
      default: 'UpComming',
    },
    roomId: {
      type: String,
    },
    online:{
      type:String,
      default: 'ON',
    },
  },
  {
    timestamps: true,
  }
);

const HostStreaming = mongoose.model('hostStreaming', hostStreamingSchema);
module.exports = { Host, HostProduct, HostStreaming};
