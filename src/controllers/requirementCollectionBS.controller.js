const httpStatus = require('http-status');
//const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const requirementCollectionService = require('../services/requirementCollectionBS.service');

const createRequirementBuyerService = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.createRequirementBuyer(req.body);
  res.status(httpStatus.CREATED).send(data);
});

// getallproduct api
const getProductAllSupplier = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getProductAllApi(req.params.userId);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found');
  }
  res.send(data);
});

// paymentHistory
const getpaymentData = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getPaymentHistory(req.params.id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'paymentData Not Found');
  }
  res.send(data);
});

const createRequirementSupplierService = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.createRequirementSupplier(req.body);
  res.status(httpStatus.CREATED).send(data);
});

const getBuyerById = catchAsync(async (req, res) => {
  const buyer = await requirementCollectionService.getByIdBuyer(req.params.buyerId);
  if (!buyer || buyer.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementBuyer Not Found');
  }
  res.send(buyer);
});

// updateData

const getUpdateDataQnty = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getUpdateDataQty(req.params.id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementSupplier Not Found');
  }
  res.send(data);
});

const getUpdateDataBuyerQnty = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getUpdateDataBuyerQty(req.params.id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementSupplier Not Found');
  }
  res.send(data);
});

const getModerateData = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getModeratedata(req.params.id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementSupplier Not Found');
  }
  res.send(data);
});

// getallApprovedLiveStream

const getallApprovedLiveStreamService = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getallApprovedLiveStream(req.params);
  res.send(data);
});

const getSupplierById = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getByIdSupplier(req.params.supplierId);
  if (!data || data.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementSupplier Not Found');
  }
  res.send(data);
});

const getShortclickById = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getBuyerShortList(req.params.id, req.params.page);
  if (!data || data.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementSupplier Not Found');
  }
  res.send(data);
});

// supplier sameProduct

const getsupplierSameProduct = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getSupplierSameProduct(req.params.id);
  if (!data || data.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementBuyer Not Found');
  }
  res.send(data);
});

// getBuyerSupplierInterest

const getsupplierBuyerInterestData = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getSupplierInterestBuyer(req.params.id);
  if (!data || data.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementBuyer Not Found');
  }
  res.send(data);
});

// getBuyerProductApi

const getBuyerProductApi = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getAllBuyerProduct(req.params.userId);
  if (!data || data.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementBuyer Not Found');
  }
  res.send(data);
});

const getfixedclickById = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getBuyerFixedList(req.params.id, req.params.page);
  if (!data || data.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementSupplier Not Found');
  }
  res.send(data);
});

const getfixedOnlyById = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getBuyerFixedOnly(req.params.id);
  if (!data || data.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementSupplier Not Found');
  }
  res.send(data);
});

const getAllBuyer = catchAsync(async (req, res) => {
  const buyer = await requirementCollectionService.getByIdBuyerAll(req.params.page);
  res.send(buyer);
});

const getAllSupplier = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getByIdSupplierAll(req.params.page);
  res.send(data);
});

const updateRequirementBuyerById = catchAsync(async (req, res) => {
  const requirement = await requirementCollectionService.updateRequirementBuyerById(req.params.buyerId, req.body);
  if (!requirement) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementBuyer Not Found');
  }
  res.send(requirement);
});

// moderateHistory

const getModerateDataHistory = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getModerateHistory(req.params.id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'moderateData Not Found');
  }
  res.send(data);
});

const updateRequirementSupplierById = catchAsync(async (req, res) => {
  const requirement = await requirementCollectionService.updateRequirementSupplierById(req.params.supplierId, req.body);
  if (!requirement) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementSupplier Not Found');
  }
  res.send(requirement);
});

const deleteRequirementBuyerById = catchAsync(async (req, res) => {
  const requirement = await requirementCollectionService.deleteRequirementBuyerById(req.params.buyerId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteRequirementSupplierById = catchAsync(async (req, res) => {
  const requirement = await requirementCollectionService.deleteRequirementSupplierById(req.params.supplierId);
  res.status(httpStatus.NO_CONTENT).send();
});

// get buyer requirement dead

const getAllBuyerNotDead = catchAsync(async (req, res) => {
  const buyer = await requirementCollectionService.getBuyerAlive(req.params.page);
  res.send(buyer);
});

const getAllBuyerProductSame = catchAsync(async (req, res) => {
  const buyer = await requirementCollectionService.getBuyerSameProduct(req.params.id, req.params.page);
  res.send(buyer);
});

// liveStreamData

const getAllLiveStreamData = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getAllLiveStreamData(req.params);
  res.send(data);
});

// getdataLiveStreamReject
const getAllLiveStreamRejectData = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getdataLiveStreamReject(req.params.userId);
  res.send(data);
});

const getAllLiveStreamApprovedData = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getdataLiveStreamApproved(req.params.userId);
  res.send(data);
});

const createArrayData = catchAsync(async (req, res) => {
  const streamData = await requirementCollectionService.createArrayData(req.body);
  res.send(streamData);
});

const createAddToCardDetails = catchAsync(async (req, res) => {
  const streamData = await requirementCollectionService.createAddToCardDetails(req.body);
  res.send(streamData);
});

const createAddToInterestDetails = catchAsync(async (req, res, next) => {
  // const action = req.body.action;
  //       const counter = action === 'Like' ? 1 : -1;
  //       addinterestdetails.update({_id: req.params.id}, {$inc: {streamInterest: counter}}, {}, (err, numberAffected) => {
  //           res.send('');
  //       });

  const streamData = await requirementCollectionService.createAddToInterestDetails(req.body);
  res.send(streamData);
});

const updateAddToInterest = catchAsync(async (req, res) => {
  const sample = await requirementCollectionService.updateAddToInterest(req.params.id, req.body);
  res.send(sample);
});

const updateAddToCartDetails = catchAsync(async (req, res) => {
  const sample = await requirementCollectionService.updateAddToCartDetails(req.params.id, req.body);
  res.send(sample);
});

const getCalculatedQuantity = catchAsync(async (req, res) => {
  const quantity = await requirementCollectionService.getCalculatedQuantity(req.params.id);
  res.send(quantity);
});

const supplierBuierDetails = catchAsync(async (req, res) => {
  const values = await requirementCollectionService.supplierBuierDetails(req.params.id);
  res.send(values);
});

const getProductDateByProductName = catchAsync(async (req, res) => {
  const data = await requirementCollectionService.getProductDateByProductName(req.params.userId, req.params.name);
  res.send(data);
});

module.exports = {
  createRequirementBuyerService,
  createRequirementSupplierService,
  getBuyerById,
  getSupplierById,
  getAllBuyer,
  getAllSupplier,
  updateRequirementBuyerById,
  updateRequirementSupplierById,
  deleteRequirementBuyerById,
  deleteRequirementSupplierById,
  getUpdateDataQnty,
  getUpdateDataBuyerQnty,
  getModerateData,
  getAllBuyerNotDead,
  getAllBuyerProductSame,
  getShortclickById,
  getfixedclickById,
  getfixedOnlyById,
  getModerateDataHistory,
  getpaymentData,
  getsupplierSameProduct,
  getsupplierBuyerInterestData,
  getProductAllSupplier,
  getBuyerProductApi,
  getAllLiveStreamData,
  getAllLiveStreamRejectData,
  getAllLiveStreamApprovedData,
  getallApprovedLiveStreamService,
  getProductDateByProductName,
  createArrayData,
  createAddToCardDetails,
  createAddToInterestDetails,
  updateAddToInterest,
  updateAddToCartDetails,
  getCalculatedQuantity,
  supplierBuierDetails,
};
