const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const {Slot,SlotSubmit} =  require('../models/slotandSlotsubmit.model')
const supplierApp = require('../models/supplierAppUser.model')

const createSlot = async (slotBody) => {
    const {supplierAppId} = slotBody;
    let ManageUser = await supplierApp.findById(supplierAppId);

    let values = {}
    values = {...slotBody, ...{supplierAppId:ManageUser._id}}
    if(ManageUser === null){
      throw new ApiError(httpStatus.NO_CONTENT, "!oops 🖕")
    }
  
  return Slot.create(values);
};

const getSlotById = async (slotId) => {
    return Slot.findById(slotId);
  };

const getAllSlot = async () => {
  return Slot.find({active:'true'});
}

const updateSlotId = async (slotId, updateBody) => {
    let Manage = await getSlotById(slotId);

    if (!Manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Slot not found');
    }
    Manage = await Slot.findByIdAndUpdate({ _id: slotId }, updateBody, { new: true });
    return Manage;
  };
  
  const deleteSlotById = async (slotId) => {
    const Manage = await getSlotById(slotId);
    if (!Manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Slot not found');
    }
    (Manage.active = false), (Manage.archive = true), await Manage.save();
    return Manage;
  };

  //slotSubmit

  const createSlotSubmit = async (slotSubmitBody) => {
    const {supplierAppId} = slotSubmitBody;
    let ManageUser = await supplierApp.findById(supplierAppId);
    let values = {}
    values = {...slotSubmitBody, ...{supplierAppId:ManageUser._id}}
    if(ManageUser === null){
      throw new ApiError(httpStatus.NO_CONTENT, "!oops 🖕")
    }
  
  return SlotSubmit.create(values);
};

const getSlotSubmitById = async (slotSubmitId) => {
    return SlotSubmit.findById(slotSubmitId);
  };

const getAllSlotSubmit = async () => {
  return SlotSubmit.find({active:'true'});
}

const updateSlotSubmitId = async (slotSubmitId, updateBody) => {
    let Manage = await getSlotSubmitById(slotSubmitId);

    if (!Manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'SlotSubmit not found');
    }
    Manage = await SlotSubmit.findByIdAndUpdate({ _id: slotSubmitId }, updateBody, { new: true });
    return Manage;
  };
  
  const deleteSlotSubmitById = async (slotSubmitId) => {
    const Manage = await getSlotSubmitById(slotSubmitId);
    if (!Manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'SlotSubmit not found');
    }
    (Manage.active = false), (Manage.archive = true), await Manage.save();
    return Manage;
  };
  module.exports = {
    createSlot,
    getSlotById,
    getAllSlot,
    updateSlotId,
   deleteSlotById,
   createSlotSubmit,
   getSlotSubmitById,
   getAllSlotSubmit,
   updateSlotSubmitId,
   deleteSlotSubmitById,

   
  };