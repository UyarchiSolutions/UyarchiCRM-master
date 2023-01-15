const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');

const streamingDataCRMSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: v4,
    },
    // StreamingData: {
    //     type: Array,
    //     default: [],
    // },
    supplierId: {
        type: String,
    },
    BuyierId: {
        type: String,

    },
    // streamAddToCart: {
    //     type: Number,
    // },
    streamFixedPrice: {
        type: Number,
    },
    streamFixedQuantity : {
        type: Number,
    },
    // streamInterest: {
    //     type: Number,
    // },
    active: {
        type: Boolean,
        default: true,
      },
      archive: {
        type: Boolean,
        default: false,
      },
      date: {
        type: String,
        default: moment().utcOffset(330).format('DD-MM-yyy'),
      },
      time: {
        type: String,
        default: moment().utcOffset(330).format('h:mm a'),
      },
      productId: {
        type: String,
      },
      productName: {
        type: String,
      },
    
});
const streamingDataCRMModel = mongoose.model('StreamingData',streamingDataCRMSchema );

module.exports = streamingDataCRMModel;
