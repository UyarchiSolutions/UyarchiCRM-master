const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const slotandSlotsubmitService = require('../services/slotandSlotsubmit.service');

const createslotService = catchAsync(async (req, res) => {
   const user = await slotandSlotsubmitService.createSlot(req.body);
  res.status(httpStatus.CREATED).send(user);
  await user.save();
});


const getslotServiceById = catchAsync(async (req, res) => {
  const pro = await slotandSlotsubmitService.getSlotById(req.params.slotId);
  if (!pro || pro.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'slot not found');
  }
  res.send(pro);
});

const getslotServiceAll = catchAsync(async (req, res) => {
    const manage = await slotandSlotsubmitService.getAllSlot(req.params);
    if (!manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'slot Not Available ');
    }
    res.send(manage);
  });


const updateslotService = catchAsync(async (req, res) => {

  const pro = await slotandSlotsubmitService.updateSlotId(req.params.slotId, req.body);
  res.send(pro);
  await pro.save();
});

const deleteslotService = catchAsync(async (req, res) => {
  await slotandSlotsubmitService.deleteSlotById(req.params.slotId);
  res.status(httpStatus.NO_CONTENT).send();
});

// slotSubmit

const createslotSubmitService = catchAsync(async (req, res) => {
    const user = await slotandSlotsubmitService.createSlotSubmit(req.body);
   res.status(httpStatus.CREATED).send(user);
   await user.save();
 });
 
 
 const getslotSubmitServiceById = catchAsync(async (req, res) => {
   const pro = await slotandSlotsubmitService.getSlotSubmitById(req.params.slotSubmitId);
   if (!pro || pro.active === false) {
     throw new ApiError(httpStatus.NOT_FOUND, 'slotSubmit not found');
   }
   res.send(pro);
 });
 
 const getslotSubmitServiceAll = catchAsync(async (req, res) => {
     const manage = await slotandSlotsubmitService.getAllSlotSubmit(req.params);
     if (!manage) {
       throw new ApiError(httpStatus.NOT_FOUND, 'slotSubmit Not Available ');
     }
     res.send(manage);
   });
 
 
 const updateslotSubmitService = catchAsync(async (req, res) => {
 
   const pro = await slotandSlotsubmitService.updateSlotSubmitId(req.params.slotSubmitId, req.body);
   res.send(pro);
   await pro.save();
 });
 
 const deleteslotSubmitService = catchAsync(async (req, res) => {
   await slotandSlotsubmitService.deleteSlotSubmitById(req.params.slotSubmitId);
   res.status(httpStatus.NO_CONTENT).send();
 });
module.exports = {
    createslotService,
    getslotServiceById,
    getslotServiceAll,
    updateslotService,
    deleteslotService,
    createslotSubmitService,
    getslotSubmitServiceById,
    getslotSubmitServiceAll,
    updateslotSubmitService,
    deleteslotSubmitService,
};