const mongoose = require('mongoose');
const { v4}=require('uuid')
const supplierInterestSchema = mongoose.Schema({
  _id :{
    type : String,
    default:v4
  },
  userId: {
    type: String,
    
  },
  supplierReqId:{
    type:String,
  },
  matchedBuyerId: {
    type: String,
  },
  interestStatus:{
    type:String,
  },
  shortlistStatus:{
    type:String,
  },
  fixedStatus:{
    type:String,
  },
  shortlistQuantity:{
    type:String,
  },

  callStatus:{
    type:String,
  },
  shortStatus:{
    type:String,
  },
  fixStatus:{
    trype:String,
  },
  interestDate:{
    type:String,
  },
  interestTime:{
    type:Number,
  },
  shortDate:{
    type:String,
   },
   shortTime:{
    type:Number,
   },
   fixDate:{
    type:String,
   },
   fixTime:{
    type:Number,
   },
   totalPrice:{
    type:Number,
   },
   buyerFixedQuantity:{
    type:Number,
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

const SupplierInterest = mongoose.model('supplierInterest', supplierInterestSchema);
module.exports = SupplierInterest ;
