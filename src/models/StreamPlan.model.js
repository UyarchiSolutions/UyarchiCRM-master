const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');

const StreamPlanSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    active: {
      type: Boolean,
      default: true,
    },
    archive: {
      type: Boolean,
      default: false,
    },
    userType: {
      type: String,
    },
    created: {
      type: Date,
    },
    DateIso: {
      type: Number,
    },
    planName: {
      type: String,
    },
    Duration: {
      type: Number,
    },
    DurationType: {
      type: String,
    },
    numberOfParticipants: {
      type: Number,
    },
    numberofStream: {
      type: Number,
    },
    validityofplan: {
      type: Number,
    },
    additionalDuration: {
      type: String,
    },
    additionalParticipants: {
      type: String,
    },
    DurationIncrementCost: {
      type: Number,
    },
    noOfParticipantsCost: {
      type: Number,
    },
    chatNeed: {
      type: String,
    },
    commision: {
      type: String,
    },
    commition_value: {
      type: Number,
    },
    regularPrice: {
      type: Number,
    },
    salesPrice: {
      type: Number,
    },
    max_post_per_stream: {
      type: Number,
    },
    planType: {
      type: String,
    },
    description: {
      type: String,
    },
    planmode: {
      type: String,
    },
    streamvalidity: {
      type: Number,
      default: 30,
    },
    no_of_host: {
      type: Number,
    },
    slotInfo: {
      type: Array,
    },
    date: {
      type: String,
    },
    Teaser: {
      type: String,
    },
    Pdf: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    PostCount: {
      type: Number,
    },
    chat_Option: {
      type: String,
    },
    RaiseHands: {
      type: String,
    },
    No_of_host: {
      type: Number,
    },
    salesCommission: {
      type: String,
    },
    Special_Notification: {
      type: String,
    },
    StreamVideos: {
      type: String,
    },
    completedStream: {
      type: String,
    },
    Advertisement_Display: {
      type: String,
    },
    Price: {
      type: Number,
    },
    Transtraction: {
      type: String,
    },
    BankName: {
      type: String,
    },
    PaymentMethod: {
      type: String,
    },
    AccNo: {
      type: String,
    },
    TransactionId: {
      type: String,
    },
    ChequeDDNo: {
      type: String,
    },
    ChequeDDdate: {
      type: String,
    },
    transaction: {
      type: String,
    },
    offer_price: {
      type: Number,
    },
    stream_validity: {
      type: Number,
    },
    Interest_View_Count: {
      type: String,
    },
    No_of_Limitations: {
      type: Number,
    },
    Service_Charges: {
      type: Number,
    },
    TimeType: {
      type: String,
    },
    raisehandcontrol: {
      type: String,
    },
    timeline: {
      type: Array,
      default: [],
    },
    No_buyer_contact_Reveals: {
      type: String,
    },
  },
  { timestamps: true }
);

const StreamPlan = mongoose.model('StreamPlane', StreamPlanSchema);

const PurchasedPlan = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    userId: {
      type: String,
    },
    planId: {
      type: String,
    },
    suppierId: {
      type: String,
    },
    userType: {
      type: String,
    },
    created: {
      type: Date,
    },
    DateIso: {
      type: Number,
    },
    paidAmount: {
      type: Number,
    },
    paymentStatus: {
      type: String,
    },
    order_id: {
      type: String,
    },
    razorpay_order_id: {
      type: String,
    },
    razorpay_payment_id: {
      type: String,
    },
    razorpay_signature: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    numberOfStreamused: {
      type: Number,
      default: 0,
    },
    noOfParticipants: {
      type: Number,
    },
    chat: {
      type: String,
    },
    max_post_per_stream: {
      type: Number,
    },
    Duration: {
      type: Number,
    },
    planType: {
      type: String,
      default: 'normal',
    },
    streamId: {
      type: String,
    },
    planName: {
      type: String,
    },
    DurationType: {
      type: String,
    },
    numberOfParticipants: {
      type: Number,
    },
    numberofStream: {
      type: Number,
    },
    validityofplan: {
      type: Number,
    },
    noOfParticipantsCost: {
      type: Number,
    },
    chatNeed: {
      type: String,
    },
    commision: {
      type: String,
    },
    commition_value: {
      type: Number,
    },
    stream_expire_hours: {
      type: Number,
    },
    stream_expire_days: {
      type: Number,
    },
    stream_expire_minutes: {
      type: Number,
    },
    regularPrice: {
      type: Number,
    },
    salesPrice: {
      type: Number,
    },

    description: {
      type: String,
    },
    planmode: {
      type: String,
    },
    expireDate: {
      type: Number,
    },
    streamvalidity: {
      type: Number,
      default: 30,
    },
    no_of_host: {
      type: Number,
    },
    Transtraction: {
      type: String,
    },
    Teaser: {
      type: String,
    },
    StreamVideos: {
      type: String,
    },
    completedStream: {
      type: String,
    },
    Pdf: {
      type: String,
    },
    Paidimage: {
      type: String,
    },
    RaiseHands: {
      type: String,
    },
    Advertisement_Display: {
      type: String,
    },
    Special_Notification: {
      type: String,
    },
    Price: {
      type: String,
    },
    slotInfo: {
      type: Array,
    },
    status: {
      type: String,
      default: 'Pending',
    },
    PayementMode: {
      type: String,
    },
    TransactionId: {
      type: String,
    },
    image: {
      type: String,
    },
    FromBank: {
      type: String,
    },
    AccountNo: {
      type: String,
    },
    ChequeDDNo: {
      type: String,
    },
    ChequeDDdate: {
      type: String,
    },
    chat_Option: {
      type: String,
    },
    salesCommission: {
      type: String,
    },
    PostCount: {
      type: Number,
    },
    approvalDate: {
      type: Number,
    },
    Discount: {
      type: Number,
      default: 0,
    },
    RevisedAmount: {
      type: Number,
    },
    Referral: {
      type: String,
    },
    Tele_Caller: {
      type: String,
    },
    TelName: {
      type: String,
    },
    Type: {
      type: String,
    },
    PayementStatus: {
      type: String,
      default: 'Pending',
    },
    PaidAmount: {
      type: Number,
      default: 0,
    },
    referal: {
      type: String,
    },
    ccavenue: {
      type: String,
    },
    ccavenue_payment_id: {
      type: String,
    },
    transaction: {
      type: String,
    },
    paymentLink: {
      type: String,
    },
    offer_price: {
      type: Number,
    },
    stream_validity: {
      type: Number,
    },
    Interest_View_Count: {
      type: String,
    },
    No_of_Limitations: {
      type: Number,
    },
    Service_Charges: {
      type: Number,
    },
    TimeType: {
      type: String,
    },
    raisehandcontrol: {
      type: String,
    },
    gst: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    userPaymentRequest: {
      type: Array,
    },
  },
  { timestamps: true }
);

const PurchasePlan = mongoose.model('purchasedplane', PurchasedPlan);

module.exports = { StreamPlan, PurchasePlan };
