const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const SupplierInterest =  require('../models/interestTable.model')
const supplier = require('../models/supplier.model')

const createinterest = async (interestBody) => {

    interestBody.data.forEach(async (e) => {
        let values = {matchedBuyerId:interestBody.BId, supplierReqId:e, interestStatus:"interest", interestDate:interestBody.interestDate, interestTime:interestBody.interestTime}
        await SupplierInterest.create(values)
      });
      return "success"
};

const getInterestById = async (interestId) => {
    return SupplierInterest.findById(interestId);
  };

const getAllInterest = async () => {
  return SupplierInterest.find({active:'true'});
}

const updateInterestId = async (interestId, updateBody) => {
    let Manage = await getInterestById(interestId);

    if (!Manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'interest not found');
    }
    Manage = await SupplierInterest.findByIdAndUpdate({ _id: interestId }, updateBody, { new: true });
    return Manage;
  };
  
  const deleteInterestById = async (interestId) => {
    const Manage = await getInterestById(interestId);
    if (!Manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'interest not found');
    }
    (Manage.active = false), (Manage.archive = true), await Manage.save();
    return Manage;
  };

  module.exports = { 
    createinterest,
    getInterestById,
    getAllInterest,
    updateInterestId,
    deleteInterestById,
  };