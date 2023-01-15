const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');

const GroupChattingSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: v4,
    },
    messageContent: {
        type: Array,
        default: [],
    },
    productId: {
        type: String,
    },
    supplierId: {
        type: String,
    },
    date: {
        type: String,
        default: moment().utcOffset(330).format('DD-MM-yyy'),
      },
      time: {
        type: String,
        default: moment().utcOffset(330).format('h:mm a'),
      },
});

const GroupChattingModel = mongoose.model('chattingGroup',GroupChattingSchema);

module.exports = GroupChattingModel;