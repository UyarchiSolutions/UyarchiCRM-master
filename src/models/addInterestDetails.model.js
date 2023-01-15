const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');

const addInterestDetailsSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: v4,
    },
  
    supplierId: {
        type: String,
    },
    BuyierId: {
        type: String,

    },
    streamInterest: {
        type: Number,
    },
   
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
      
    
});
const addInterestDetailsModel = mongoose.model('addInterestDetails',addInterestDetailsSchema );

module.exports = addInterestDetailsModel;