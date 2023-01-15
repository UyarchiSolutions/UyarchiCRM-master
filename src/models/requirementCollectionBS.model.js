const mongoose = require('mongoose');
const { v4 } = require('uuid');

const requirementBuyerSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  name: {
    type: String,
  },
  userId: {
    type: String,
  },
  product: {
    type: String,
  },
  minrange: {
    type: Number,
  },
  maxrange: {
    type: Number,
  },
  minprice: {
    type: Number,
  },
  maxprice: {
    type: Number,
  },
  pdelivery: {
    type: String,
  },
  deliverylocation: {
    type: String,
  },
  deliveryDate:{
    type:String,
  },
  deliveryTime:{
    type:Number,
  },
  date:{
    type:String,
  },
  time:{
    type:Number,
},
lat:{
    type:Number,
},
lang:{
    type:Number,
},
status:{
    type:String,
  },
requirementAddBy:{
    type:String,
  },
  statusAccept:{
    type:String,
  },
  reasonCallback:{
    type:String,
  },
  dateCallback:{
    type:String,
  },
  aliveFeedback:{
    type:String,
  },
  deadFeedback:{
    type:String,
  },
  modificationFeedback:{
    type:String,
  },
  feedbackCallback:{
    type:String,
  },
  matchesStatus:{
    type:String,
  },
  interestCount:{
    type:Number,
  },
  confirmCallStatus:{
    type:String,
  },
  confirmCallStatusDate:{
    type:String,
  },
  confirmCallStatusTime:{
    type:Number,
  },
  fixCallStatus:{
    type:String,
  },
  fixCallStatusDate:{
    type:String,
  },
  fixCallStatusTime:{
    type:Number,
  },
  paymentCallStatus:{
    type:String,
  },
  paymentConfirmCallStatus:{
    type:String,
  },
  billId:{
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

const RequirementBuyer = mongoose.model('requirementBuyer', requirementBuyerSchema);
const requirementSupplierSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: v4,
    },
    name: {
      type: String,
    },
    userId: {
      type: String,
    },
    product: {
      type: String,
    },
    type:{
      type:String,
    },
   stockLocation:{
    type:String,
   },
   requirementAddBy:{
    type:String,
   },
   stockAvailabilityDate:{
    type:String,
   },
   stockAvailabilityTime:{
    type:Number,
   },
   stockPosition:{
    type:String,
   },
   packType:{
    type:String,
   },
   expectedQnty:{
    type:Number,
   },
   expectedPrice:{
    type:Number,
   },
   paymentMode:{
    type:String,
   },
   advance:{
    type:String,
   },
   reason:{
    type:String,
   },

    date:{
      type:String,
    },
    time:{
      type:Number,
  },
  lat:{
      type:Number,
  },
  lang:{
      type:Number,
  },
  status:{
    type:String,
  },
  statusAccept:{
    type:String,
  },
  reasonCallback:{
    type:String,
  },
  dateCallback:{
    type:String,
  },
  aliveFeedback:{
    type:String,
  },
  deadFeedback:{
    type:String,
  },
  modificationFeedback:{
    type:String,
  },
  feedbackCallback:{
    type:String,
  },
  moderatedPrice:{
    type:Number,
    deafault: 0,
  },
  moderateDate:{
    type:String,
  },
  moderateTime:{
    type:Number,
  },
  moderateStatus:{
    type:String,
  },
  supplierInterest:{
    type:String,
  },
  matchedBuyerId:{
    type:String,
  },
  moderateReason:{
    type:String,
  },
  minimumlot:{
    type:Number,
  },
  maximumlot:{
    type:Number,
  },
  stockTakeFromDay:{
    type:String,
  },
  stockTakeToDay:{
    type:String,
  },
  paymentFromDay:{
    type:String,
  },
  paymentToDay:{
    type:String,
  },
  billId:{
    type:String,
  },
  liveStreamDate:{
    type:String,
  },
  liveStreamTime:{
    type:String,
  },
  liveStream_To_Time:{
    type:String,
  },
  liveStreamStatus:{
    type:String,
  },
  liveStreamReason:{
    type:String,
  },
  streamInterest:{
    type:String, 
  },
  streamAddToCart:{
    type:String, 
  },
  streamFixedQuantity:{
    type:String, 
  },
  streamFixedPrice:{
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
  
  const RequirementSupplier = mongoose.model('requirementSupplier', requirementSupplierSchema);

module.exports = {
    RequirementBuyer,
    RequirementSupplier,
}
