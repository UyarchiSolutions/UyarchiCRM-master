const mongoose = require('mongoose');
const { v4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { string } = require('joi');

// seller and buyer register Schema

const BuyerSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  userName: {
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  Type: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
  },
  accountActive: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
  },
  date: {
    type: String,
  },
  plane: {
    type: Number,
  },
  videos: {
    type: Number,
  },
  Image: {
    type: Number,
  },
  Role: {
    type: String,
  },
  contactView: {
    type: Number,
  },
  password: {
    type: String,
  },
});

const Buyer = mongoose.model('buyers', BuyerSchema);

const BuyerSellerSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  userName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  mobile: {
    type: Number,
    required: true,
    // unique: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  Type: {
    type: String,
  },
  plane: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
  },
  ownerType: {
    type: String,
  },
  date: {
    type: String,
  },
  password: {
    type: String,
  },
});

const BuyerSeller = mongoose.model('buyer', BuyerSellerSchema);

BuyerSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

BuyerSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
// seller and buyer Otp Schema

const BuyerSellerOTPSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  Otp: {
    type: Number,
  },
  mobile: {
    type: Number,
  },
  email: {
    type: String,
  },
  created: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const BuyerSellerOTP = mongoose.model('buyersellerotp', BuyerSellerOTPSchema);

// Seller Post Requirement Schema
const sellerPostSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  otherFeature: {
    type: String,
  },
  buildingType: {
    type: String,
  },
  leaseDuration: {
    type: String,
  },
  lock_in_period: {
    type: String,
  },
  security: {
    type: String,
  },
  escalator: {
    type: String,
  },
  waterStorage: {
    type: String,
  },
  wifi: {
    type: String,
  },
  Lift: {
    type: String,
  },
  washroom: {
    type: String,
  },
  preOccupy: {
    type: String,
  },
  ideaFor: {
    type: String,
  },
  AdvanceAmt: {
    type: String,
  },
  location: {
    type: String,
  },
  kitchenType: {
    type: String,
  },
  landMark: {
    type: String,
  },
  Completion_certificate: {
    type: String,
  },
  pineCode: {
    type: Number,
  },
  BuildingName: {
    type: String,
  },
  maintanencetype: {
    type: String,
  },
  formatedAddress: {
    type: String,
  },
  parkingCount: {
    type: String,
  },
  rentDetails: {
    type: String,
  },
  fourWheelerCount: {
    type: String,
  },
  advanceNegotiable: {
    type: String,
  },
  Type: {
    // type like seller render
    type: String,
  },
  Accept: {
    type: Array,
    default: [],
  },
  planedata: {
    type: Object,
  },
  Ignore: {
    type: Array,
    default: [],
  },
  primaryContactNumber: {
    type: Number,
  },
  secondaryContactNumber: {
    type: Number,
  },
  userName: {
    type: String,
  },
  maintainenceCost: {
    type: Number,
  },
  ownerType: {
    type: String,
  },
  leaseRent: {
    type: String,
  },
  contructionDocuments: {
    type: Array,
    default: [],
  },
  ifMaintenence: {
    type: String,
  },
  openHouse: {
    type: String,
  },
  viewedUsers: {
    type: Array,
  },
  propertType: {
    type: String,
  },
  WhishList: {
    type: Array,
    default: [],
  },
  lat: {
    type: Number,
  },
  long: {
    type: Number,
  },
  expectedPrice: {
    type: String,
  },
  current_in_loan: {
    type: String,
  },
  availability: {
    type: String,
  },
  availabilityDate: {
    type: String,
  },
  HouseOrCommercialType: {
    type: String,
  },
  MonthlyRentFrom: {
    type: Number,
  },
  MonthlyRentTo: {
    type: Number,
  },
  depositeAmount: {
    type: Number,
  },
  RentPrefer: {
    type: String,
  },
  intrestedUsers: [],
  like: {
    type: String,
  },
  IfCommercial: {
    type: String,
  },
  RentNegociable: {
    type: String,
  },
  depositeNegociable: {
    type: String,
  },
  propertStatus: {
    type: String,
  },
  ageOfBuilding: {
    type: String,
  },
  userId: {
    type: String,
  },
  homeOrflat: {
    type: String,
  },
  homeFlatType: {
    type: String,
  },
  flat: {
    type: String,
  },
  Address: {
    type: String,
  },
  landMark: {
    type: String,
  },
  visit: {
    type: Date,
  },
  furnishingStatus: {
    type: String,
  },
  parkingStatus: {
    type: String,
  },
  parkingFacilities: {
    type: String,
    default: '',
  },
  bathRoomType: {
    type: String,
  },
  bathRoomCount: {
    type: String,
  },
  balconyCount: {
    type: String,
  },
  waterSupply: {
    type: String,
  },
  toiletType: {
    type: String,
  },
  AdditionalDetails: {
    type: Array,
  },
  image: {
    type: Array,
  },
  videos: {
    type: Array,
  },
  discription: {
    type: String,
  },
  landSize: {
    type: String,
  },
  BuildedSize: {
    type: String,
  },
  squareFT: {
    type: String,
  },
  buildingDirection: {
    type: String,
  },
  created: {
    type: Date,
  },
  date: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  expiredDate: {
    type: String,
  },
  BHKType: {
    type: String,
  },
  price: {
    type: Number,
  },
  floorNo: {
    type: String,
  },
  noOfFloor: {
    type: String,
  },
  propertyExpired: {
    type: Boolean,
    default: false,
  },
  propertyExpiredDate: {
    type: Date,
  },
  udsArea: {
    type: String,
  },
  city: {
    type: String,
  },
  periodOfRentFrom: {
    type: String,
  },
  periodOfRentTo: {
    type: String,
  },
  powerBackup: {
    type: String,
  },
  property_Tax: {
    type: String,
  },
  sale_Deed_Certificate: {
    type: String,
  },
  occuPency_certificate: {
    type: String,
  },
  locality: {
    type: String,
  },
  MaintenanceStatus: {
    type: String,
  },
  roomType: {
    type: Array,
  },
  floorType: {
    type: Array,
  },
  propStatus: {
    type: String,
    default: 'Pending',
  },
  Non_veg: {
    type: String,
  },
  gate_Security: {
    type: String,
  },
  // flooring Tpe
  kitchen: {
    type: String,
  },
  hall_FLoor: {
    type: String,
  },
  bedRoom: {
    type: String,
  },
  bathRoom: {
    type: String,
  },
  balCony: {
    type: String,
  },
  Amenities: {
    type: Array,
    default: [],
  },
  contactName: {
    type: String,
  },
  facingDirection: {
    type: String,
  },
  final: {
    type: String,
  },
  area: {
    type: String,
  },
});

const SellerPost = mongoose.model('sellerPost', sellerPostSchema);

const BuyerRentieSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  Type: {
    // like Buye or Rentiee
    type: String,
  },
  TyoesOfProperty: {
    type: String,
  },
  maintainenceCost: {
    type: Number,
  },
  ifMaintenence: {
    type: String,
  },
  HouseOrCommercialType: {
    type: String,
  },
  PropertyStatus: {
    type: String,
  },
  PrefferedState: {
    type: String,
  },
  prefferedLocation: {
    type: String,
  },
  bathroomCount: {
    type: String,
  },
  PrefferedCities: {
    type: String,
  },
  Area: {
    type: String,
  },
  Locality: {
    type: String,
  },
  BHKType: {
    type: String,
  },
  sellerType: {
    type: String,
  },
  userId: {
    type: String,
  },
  bathRoomType: {
    type: String,
  },
  availabilityDate: {
    type: String,
  },
  availability: {
    type: String,
  },
  FromPrice: {
    type: Number,
  },
  ToPrice: {
    type: Number,
  },
  ParkingPreference: {
    type: String,
  },
  FurnishingStatus: {
    type: String,
  },
  PreferenceList: {
    type: String,
  },
  propStatus: {
    type: String,
    default: 'Pending',
  },
  visit: {
    type: String,
  },
  facingDirection: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
  },
  date: {
    type: String,
  },
});

const BuyerRentie = mongoose.model('buyerrentie', BuyerRentieSchema);

const PropertLikesSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  userId: {
    type: String,
  },
  propertyId: {
    type: String,
  },
  status: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
  },
});

const PropertLikes = mongoose.model('propertylikes', PropertLikesSchema);

const AdminSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  userName: {
    type: String,
  },
  password: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const Admin = mongoose.model('AdminSchema', AdminSchema);

module.exports = {
  BuyerSeller,
  BuyerSellerOTP,
  SellerPost,
  BuyerRentie,
  Buyer,
  PropertLikes,
  Admin,
};
