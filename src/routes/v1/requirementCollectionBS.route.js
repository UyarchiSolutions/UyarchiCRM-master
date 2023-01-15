const express = require('express');
const requirementCollectionController = require('../../controllers/requirementCollectionBS.controller');
const router = express.Router();
router.route('/Buyer').post(requirementCollectionController.createRequirementBuyerService)
router.route('/Buyer/:page').get(requirementCollectionController.getAllBuyer)
router.route('/Supplier').post(requirementCollectionController.createRequirementSupplierService)
router.route('/Supplier/:page').get(requirementCollectionController.getAllSupplier)
router
  .route('/Buyer/:buyerId')
  .get(requirementCollectionController.getBuyerById)
  .put(requirementCollectionController.updateRequirementBuyerById)
  .delete(requirementCollectionController.deleteRequirementBuyerById);

router
  .route('/Supplier/specific/:supplierId')
  .get(requirementCollectionController.getSupplierById)
  .put(requirementCollectionController.updateRequirementSupplierById)
  .delete(requirementCollectionController.deleteRequirementSupplierById);

// updateData
router.route('/Supplier/UpdataData/:id').get(requirementCollectionController.getUpdateDataQnty)
router.route('/Buyer/UpdataData/:id').get(requirementCollectionController.getUpdateDataBuyerQnty)
router.route('/Supplier/UpdateModerate/:id').get(requirementCollectionController.getModerateData)

// BuyerNotDead
router.route('/Buyer/Live/all/:page').get(requirementCollectionController.getAllBuyerNotDead)
router.route('/Buyer/SameProduct/all/:id/:page').get(requirementCollectionController.getAllBuyerProductSame)
router.route('/Buyer/SameProduct/short/all/:id/:page').get(requirementCollectionController.getShortclickById)
router.route('/Buyer/SameProduct/fixed/all/:id/:page').get(requirementCollectionController.getfixedclickById)
router.route('/Buyer/SameProduct/fixed/only/all/:id').get(requirementCollectionController.getfixedOnlyById)

//moderateHistory
router.route('/supplier/moderateHistory/all/:id').get(requirementCollectionController.getModerateDataHistory)

//paymentHistory

router.route('/Buyer/paymentdataHistory/all/data/:id').get(requirementCollectionController.getpaymentData)

//supplierSameProduct
router.route('/Supplier/sameProduct/all/data/:id').get(requirementCollectionController.getsupplierSameProduct)
router.route('/Supplier/interestData/:id').get(requirementCollectionController.getsupplierBuyerInterestData)

// getAllSupplierProduct
router.route('/Supplier/product/data/:userId').get(requirementCollectionController.getProductAllSupplier)

// getAllBuyerProuctData
router.route('/Buyer/product/data/:userId').get(requirementCollectionController.getBuyerProductApi)

//getAllDataLiveStream

router.route('/SupplierLiveStrem/all/data').get(requirementCollectionController.getAllLiveStreamData)

// getDataLiveStreamReject
router.route('/SupplierLiveReject/all/data/:userId').get(requirementCollectionController.getAllLiveStreamRejectData)


// getDataLiveStreamApproved
router.route('/SupplierLiveApproved/data/:userId').get(requirementCollectionController.getAllLiveStreamApprovedData)

//getAllBuyerLiveStatusApprovedData

router.route('/BuyerData/liveApproved/SameProduct').get(requirementCollectionController.getallApprovedLiveStreamService);

router.route('/StreamingData/createArrayData').post(requirementCollectionController.createArrayData);

router.route('/create/AddToCardDetails').post(requirementCollectionController.createAddToCardDetails);

router.route('/create/AddToInterestDetails').post(requirementCollectionController.createAddToInterestDetails);

router.route('/update/AddTo/Interest/:id').put(requirementCollectionController.updateAddToInterest);

router.route('/update/AddTo/Cart/:id').put(requirementCollectionController.updateAddToCartDetails);

router.route('/get/quantityDetails/:id').get(requirementCollectionController.getCalculatedQuantity);

router.route('/get/supplier/Buyer/details/:id').get(requirementCollectionController.supplierBuierDetails);

router.route('/getProduct/date/:userId/:name').get(requirementCollectionController.getProductDateByProductName)

module.exports = router;