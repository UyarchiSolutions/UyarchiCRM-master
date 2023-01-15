const mongoose = require('mongoose');
const { v4}=require('uuid')
const supplierRequirementUpdateSchema = mongoose.Schema({
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
  updatedQty: {
    type: Number,
  },
  price: {
    type: Number,
  },
  stockLocation: {
    type: String,
  },
  date:{
    type:String,
  },
  time:{
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

const SupplierRequirementUpdate = mongoose.model('supplierRequirementUpdate', supplierRequirementUpdateSchema);
const buyerRequirementUpdateSchema = mongoose.Schema({
  _id :{
    type : String,
    default:v4
  },
  userId: {
    type: String,
    
  },
  buyerReqId:{
    type:String,
  },
  QtyMin: {
    type: Number,
  },
  QtyMax: {
    type: Number,
  },
  priceMin: {
    type: Number,
  },
  priceMax:{
    type:Number,
  },
  deliveryLocation:{
    type:String,
  },
  date:{
    type:String,
  },
  time:{
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

const BuyerRequirementUpdate = mongoose.model('buyerRequirementUpdate', buyerRequirementUpdateSchema);
const supplierModerateUpdateSchema = mongoose.Schema({
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
  moderatedPrice: {
    type: Number,
  },
  date:{
    type:String,
  },
  time:{
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

const SupplierModerateUpdate = mongoose.model('supplierModerateUpdate', supplierModerateUpdateSchema);
module.exports = {
  SupplierRequirementUpdate,
  BuyerRequirementUpdate,
  SupplierModerateUpdate,
};
