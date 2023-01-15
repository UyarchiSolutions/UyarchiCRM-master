const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const slotSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
   slotDate:{ 
    type:String,
  },
  slotTime:{
    type:String,
  },
  supplierAppId:{
    type:String,
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

const Slot = mongoose.model('supplierSlot', slotSchema);

const slotSubmitSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: v4,
    },
     product:{ 
      type:String,
    },
    quantity:{
      type:Number,
    },
    proposedPrice:{
        type:String,
    },
    proposedQuantity:{
        type:String,
    },
    supplierAppId:{
        type:String,
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
  
  const SlotSubmit = mongoose.model('supplierSlotSubmit', slotSubmitSchema);

module.exports = {Slot,SlotSubmit};