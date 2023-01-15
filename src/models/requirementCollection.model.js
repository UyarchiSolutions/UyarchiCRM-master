const mongoose = require('mongoose');
const { v4 } = require('uuid');

const requirementCollectionSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  type: {
    type: String,
  },
  name: {
    type: String,
  },
  buyerpname: {
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
  buyerdeliverydate: {
    type: String,
  },
  supplierpname: {
    type: String,
  },
  stocklocation: {
    type: String,
  },
  stockposition: {
    type: String,
  },
  stockavailabilitydate: {
    type: String,
  },
  packtype: {
    type: String,
  },
  expquantity: {
    type: Number,
  },
  expprice: {
    type: Number,
  },
  paymentmode: {
    type: String,
  },
  supplierid: {
    type: Number,
  },
  buyerid: {
    type: Number,
  },
  selectboth: {
    type: String,
  },
  advance: {
    type: Number,
  },
  Date: {
    type: String,
  },
  status:{
    type:String,
  },
  reasonCallback:{
    type:String,
  },
  dateCallback:{
    type:String,
  },
  feedbackCallback:{
    type:String,
  },
  statusAccept:{
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
  moderateStatus:{
    type:String,
  },
  editedPrice:{
    type:Number,
  },
  moderateRejectReason:{
    type:String,
  },
  Blatitude:{
    type:Number,
  },
  Blongitude:{
   type:Number,
 },
  Slatitude:{
  type:Number,
 },
  Slongitude:{
     type:Number,
 },
 matchesstatus:{
  type:String,
 },
 interestedBId:{
  type:String,
 },
 interestedDate:{
  type:String,
 },
 interestedProduct:{
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

const RequirementCollection = mongoose.model('RequirementCollection', requirementCollectionSchema);

module.exports = RequirementCollection;
