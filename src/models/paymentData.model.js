const mongoose = require('mongoose');
const { v4}=require('uuid')
const paymentDataScheme = mongoose.Schema({
  _id :{
    type : String,
    default:v4
  },
  totalPrice:{
    type:Number,
  },
  paymentMode:{
    type:String,
  },
  paymentType:{
    type:String,
  },
  amountPaid:{
    type:String,
  },
  supplierId:{
    type:Array,
  },
  buyerId:{
    type:String,
  },
  date:{
    type:String,
  },
  time:{
    type:Number,
  },
  BillId:{
    type:String,
  },
  status:{
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

const PaymentData = mongoose.model('paymentData', paymentDataScheme);
module.exports = PaymentData;
