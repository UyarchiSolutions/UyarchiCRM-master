const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const paymentData =  require('../models/paymentData.model')
const moment = require('moment');
let currentDate = moment().format('DD-MM-YYYY');


const createpaymentData = async (paymentBody) => {
  let billcount = await paymentData.find({ date: currentDate }).count();
  let center = '';
  if (billcount < 9) {
    center = '000000';
  }
  if (billcount < 99 && billcount >= 9) {
    center = '00000';
  }
  if (billcount < 999 && billcount >= 99) {
    center = '0000';
  }
  if (billcount < 9999 && billcount >= 999) {
    center = '000';
  }
  if (billcount < 99999 && billcount >= 9999) {
    center = '00';
  }
  if (billcount < 999999 && billcount >= 99999) {
    center = '0';
  }
  let total = billcount + 1;
  let billid = "BI-UYAR"+ center + total;
  let value = {...paymentBody, ...{ BillId: billid, } };
  return paymentData.create(value);

};

const getpaymentDataById = async (paymentId) => {
    return paymentData.findById(paymentId);
  };

const getAllpaymentData = async () => {
  return paymentData.find({active:'true'});
}

const updatepaymentDataId = async (paymentId, updateBody) => {
    let Manage = await getpaymentDataById(paymentId);

    if (!Manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'paymentData not found');
    }
    Manage = await paymentData.findByIdAndUpdate({ _id: paymentId }, updateBody, { new: true });
    return Manage;
  };
  
  const deletepaymentDataById = async (paymentId) => {
    const Manage = await getpaymentDataById(paymentId);
    if (!Manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'paymentData not found');
    }
    (Manage.active = false), (Manage.archive = true), await Manage.save();
    return Manage;
  };

  module.exports = { 
    createpaymentData,
    getpaymentDataById,
    getAllpaymentData,
    updatepaymentDataId,
    deletepaymentDataById,
  };