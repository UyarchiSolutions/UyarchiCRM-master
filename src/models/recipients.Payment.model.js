const mongoose = require('mongoose');
const { v4 } = require('uuid');

const RecipentPaymentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  streamingId: {
    type: String,
  },
  status: {
    type: String,
    default: 'Pending',
  },
  paidAmt: {
    type: Number,
  },
  hostId: {
    type: String,
  },
  Qty: {
    type: Number,
  },
  Price: {
    type: Number,
  },
  created: {
    type: Date,
  },
  date: {
    type: String,
  },
  recipientId: {
    type: String,
  },
  time: {
    typeP: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const RecipentPayments = mongoose.model('RecipentPayments', RecipentPaymentSchema);

module.exports = RecipentPayments;
