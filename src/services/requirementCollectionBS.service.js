const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { RequirementBuyer, RequirementSupplier } = require('../models/requirementCollectionBS.model');
const {
  SupplierRequirementUpdate,
  BuyerRequirementUpdate,
  SupplierModerateUpdate,
} = require('../models/requirementUpdateBS');
const paymentData = require('../models/paymentData.model');
const { SupplierInterest } = require('../models/interestTable.model');
const supplier = require('../models/supplier.model');
const axios = require('axios');
const moment = require('moment');
let currentDate = moment().format('DD-MM-YYYY');
const liveStreamservice = require('../services/liveStream.service');
const StreamingDataModel = require('../models/streamingDataCRM.model');
const liveStreamModel = require('../models/liveStream.model');

const createRequirementBuyer = async (buyerBody) => {
  const { userId } = buyerBody;
  let supp = await supplier.findById(userId);
  // let values = {};
  // values = { ...buyerBody, ...{ userId: supp._id } };
  if (supp === null) {
    throw new ApiError(httpStatus.NO_CONTENT, '!oops 🖕');
  }
  let billcount = await RequirementBuyer.find({ date: currentDate }).count();
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
  let billid = 'BID' + center + total;
  let values = { ...buyerBody, ...{ billId: billid, userId: supp._id } };
  return RequirementBuyer.create(values);
};

const getProductDateByProductName = async (userId, name) => {
  let productname = await RequirementSupplier.find({ userId: userId, product: name });
  if (!productname) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product Name Does not Match');
  }
  return productname;
};

const createArrayData = async (body) => {
  let sample = await StreamingDataModel.create(body);
  return sample;
};

const createRequirementSupplier = async (supplierBody) => {
  const { userId } = supplierBody;
  let supp = await supplier.findById(userId);
  // let values = {};
  // values = { ...buyerBody, ...{ userId: supp._id } };
  if (supp === null) {
    throw new ApiError(httpStatus.NO_CONTENT, '!oops 🖕');
  }
  let billcount = await RequirementSupplier.find({ date: currentDate }).count();

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
  let billid = 'BID' + center + total;
  let values = { ...supplierBody, ...{ billId: billid, userId: supp._id } };

  let requirement = await RequirementSupplier.create(values);
  if (supplierBody.type == 'own') {
    await liveStreamservice.createLiveStream({ userId: supp._id, requirementId: requirement._id });
  }
  return requirement;
};

const getByIdBuyer = async (buyerId) => {
  return RequirementBuyer.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: buyerId } }, { active: { $eq: true } }],
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliersData',
      },
    },
    {
      $unwind: '$suppliersData',
    },
    {
      $project: {
        name: '$suppliersData.primaryContactName',
        secretName: '$suppliersData.secretName',
        mobileNumber: '$suppliersData.primaryContactNumber',
        _id: 1,
        minrange: 1,
        maxrange: 1,
        minprice: 1,
        maxprice: 1,
        pdelivery: 1,
        deliverylocation: 1,
        deliveryDate: 1,
        deliveryTime: 1,
        requirementAddBy: 1,
        date: 1,
        time: 1,
        lat: 1,
        lang: 1,
        status: 1,
        product: 1,
        status: 1,
        advance: 1,
        statusAccept: 1,
        reasonCallback: 1,
        dateCallback: 1,
        aliveFeedback: 1,
        deadFeedback: 1,
        modificationFeedback: 1,
        feedbackCallback: 1,
      },
    },
  ]);
};

// paymentHistory

const getProductAllApi = async (userId) => {
  // console.log(userId)
  return RequirementSupplier.aggregate([
    {
      $match: {
        $and: [{ userId: { $eq: userId } }],
      },
    },
  ]);
};

// getAllBuyerProduct
const getAllBuyerProduct = async (userId) => {
  return RequirementBuyer.aggregate([
    {
      $match: {
        $and: [{ userId: { $eq: userId } }],
      },
    },
  ]);
};

const getByIdSupplier = async (supplierId) => {
  return RequirementSupplier.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: supplierId } }],
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliersData',
      },
    },
    {
      $unwind: '$suppliersData',
    },
    {
      $project: {
        name: '$suppliersData.primaryContactName',
        secretName: '$suppliersData.secretName',
        _id: 1,
        userId: 1,
        product: 1,
        stockLocation: 1,
        stockPosition: 1,
        packType: 1,
        expectedPrice: 1,
        expectedQnty: 1,
        paymentMode: 1,
        requirementAddBy: 1,
        stockAvailabilityDate: 1,
        stockAvailabilityTime: 1,
        date: 1,
        time: 1,
        lat: 1,
        lang: 1,
        status: 1,
        advance: 1,
        status: 1,
        advance: 1,
        statusAccept: 1,
        reasonCallback: 1,
        dateCallback: 1,
        aliveFeedback: 1,
        deadFeedback: 1,
        modificationFeedback: 1,
        feedbackCallback: 1,
        moderatedPrice: 1,
        moderateStatus: 1,
        moderateTime: 1,
        moderateDate: 1,
      },
    },
  ]);
};

const getByIdBuyerAll = async (page) => {
  let value = await RequirementBuyer.aggregate([
    {
      $match: {
        $and: [{ active: { $eq: true } }],
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliersData',
      },
    },
    {
      $unwind: '$suppliersData',
    },
    {
      $project: {
        name: '$suppliersData.primaryContactName',
        secretName: '$suppliersData.secretName',
        _id: 1,
        minrange: 1,
        maxrange: 1,
        minprice: 1,
        maxprice: 1,
        pdelivery: 1,
        deliverylocation: 1,
        deliveryDate: 1,
        deliveryTime: 1,
        requirementAddBy: 1,
        date: 1,
        time: 1,
        lat: 1,
        lang: 1,
        status: 1,
        product: 1,
        status: 1,
        advance: 1,
        statusAccept: 1,
        reasonCallback: 1,
        dateCallback: 1,
        aliveFeedback: 1,
        deadFeedback: 1,
        modificationFeedback: 1,
        feedbackCallback: 1,
        confirmCallStatus: 1,
        confirmCallStatusDate: 1,
        confirmCallStatusTime: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await RequirementBuyer.aggregate([
    {
      $match: {
        $and: [{ active: { $eq: true } }],
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliersData',
      },
    },
    {
      $unwind: '$suppliersData',
    },
  ]);
  return { value: value, total: total.length };
};

const getByIdSupplierAll = async (page) => {
  let value = await RequirementSupplier.aggregate([
    {
      $match: {
        $and: [{ active: { $eq: true } }],
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliersData',
      },
    },
    {
      $unwind: '$suppliersData',
    },
    {
      $lookup: {
        from: 'supplierinterests',
        localField: '_id',
        foreignField: 'supplierReqId',
        pipeline: [
          {
            $match: {
              $and: [{ active: { $eq: true } }],
            },
          },
        ],
        as: 'supplierinterestsData',
      },
    },
    {
      $lookup: {
        from: 'requirementbuyers',
        localField: 'product',
        foreignField: 'product',
        pipeline: [
          {
            $match: {
              $and: [{ active: { $eq: true } }],
            },
          },
        ],
        as: 'requirementbuyersData',
      },
    },
    // {
    //   $unwind: '$supplierinterestsData',
    // },
    {
      $project: {
        name: '$suppliersData.primaryContactName',
        secretName: '$suppliersData.secretName',
        interestCount: { $size: '$supplierinterestsData' },
        sameProductCount: { $size: '$requirementbuyersData' },
        _id: 1,
        userId: 1,
        product: 1,
        stockLocation: 1,
        requirementAddBy: 1,
        stockPosition: 1,
        packType: 1,
        expectedPrice: 1,
        expectedQnty: 1,
        paymentMode: 1,
        date: 1,
        time: 1,
        lat: 1,
        lang: 1,
        status: 1,
        advance: 1,
        statusAccept: 1,
        reasonCallback: 1,
        dateCallback: 1,
        aliveFeedback: 1,
        deadFeedback: 1,
        modificationFeedback: 1,
        feedbackCallback: 1,
        moderatedPrice: 1,
        moderateStatus: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await RequirementSupplier.aggregate([
    {
      $match: {
        $and: [{ active: { $eq: true } }],
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliersData',
      },
    },
    {
      $unwind: '$suppliersData',
    },
    {
      $lookup: {
        from: 'supplierinterests',
        localField: '_id',
        foreignField: 'supplierReqId',
        pipeline: [
          {
            $match: {
              $and: [{ active: { $eq: true } }],
            },
          },
        ],
        as: 'supplierinterestsData',
      },
    },
    {
      $lookup: {
        from: 'requirementbuyers',
        localField: 'product',
        foreignField: 'product',
        pipeline: [
          {
            $match: {
              $and: [{ active: { $eq: true } }],
            },
          },
        ],
        as: 'requirementbuyersData',
      },
    },
    // {
    //   $unwind: '$supplierinterestsData',
    // },
  ]);
  return { value: value, total: total.length };
};

// supplier matches
const getSupplierSameProduct = async (id) => {
  const data = await RequirementSupplier.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'requirementbuyers',
        localField: 'product',
        foreignField: 'product',
        pipeline: [
          //   {
          //     $match: {
          //       $and: [{ moderateStatus: { $eq: 'Moderated' } }],
          //     },
          //   },
          // {
          //   $lookup: {
          //     from: 'supplierinterests',
          //     localField: '_id',
          //     foreignField: 'matchedBuyerId',
          //     pipeline: [
          //       {
          //         $match:{
          //           $and:[{active:{$eq:true}}]
          //         },
          //       },
          //     ],
          //     as: 'supplierReqId',
          //   },
          // },
          {
            $lookup: {
              from: 'suppliers',
              localField: 'userId',
              foreignField: '_id',
              as: 'suppliersData',
            },
          },
          {
            $unwind: '$suppliersData',
          },
        ],
        as: 'requirementsuppliersData',
      },
    },
    {
      $unwind: '$requirementsuppliersData',
    },

    {
      $project: {
        name: '$requirementsuppliersData.suppliersData.primaryContactName',
        secretName: '$requirementsuppliersData.suppliersData.secretName',
        createdBy: '$requirementsuppliersData.suppliersData.createdBy',
        requirementAddBy: '$requirementsuppliersData.requirementAddBy',
        product: '$requirementsuppliersData.product',
        buyerId: '$requirementsuppliersData._id',
        minrange: '$requirementsuppliersData.minrange',
        maxrange: '$requirementsuppliersData.maxrange',
        minprice: '$requirementsuppliersData.minprice',
        maxprice: '$requirementsuppliersData.maxprice',
        pdelivery: '$requirementsuppliersData.pdelivery',
        deliverylocation: '$requirementsuppliersData.deliverylocation',
        deliveryDate: '$requirementsuppliersData.deliveryDate',
        deliveryTime: '$requirementsuppliersData.deliveryTime',
        lat: '$requirementsuppliersData.lat',
        lang: '$requirementsuppliersData.lang',
        date: '$requirementsuppliersData.date',
        time: '$requirementsuppliersData.time',
        status: '$requirementsuppliersData.status',
        matchesStatus: '$requirementsuppliersData.matchesStatus',
        interestCount: '$requirementsuppliersData.interestCount',
        billId: '$requirementsuppliersData.billId',
        aliveFeedback: '$requirementsuppliersData.aliveFeedback',
        deadFeedback: '$requirementsuppliersData.deadFeedback',
        feedbackCallback: '$requirementsuppliersData.feedbackCallback',
        modificationFeedback: '$requirementsuppliersData.modificationFeedback',
        reasonCallback: '$requirementsuppliersData.reasonCallback',
        statusAccept: '$requirementsuppliersData.statusAccept',
        confirmCallStatus: '$requirementsuppliersData.confirmCallStatus',
        confirmCallStatusDate: '$requirementsuppliersData.confirmCallStatusDate',
        confirmCallStatusTime: '$requirementsuppliersData.confirmCallStatusTime',
        fixCallStatus: '$requirementsuppliersData.fixCallStatus',
        paymentCallStatus: '$requirementsuppliersData.paymentCallStatus',
        paymentConfirmCallStatus: '$requirementsuppliersData.paymentConfirmCallStatus',
      },
    },
  ]);

  return data;
};

// supplier intrestBuyer

const getSupplierInterestBuyer = async (id) => {
  const data = await RequirementSupplier.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'supplierinterests',
        localField: '_id',
        foreignField: 'supplierReqId',
        pipeline: [
          {
            $match: {
              $and: [{ active: { $eq: true } }],
            },
          },
        ],
        as: 'supplierReqId',
      },
    },
    {
      $unwind: '$supplierReqId',
    },
    {
      $lookup: {
        from: 'requirementbuyers',
        localField: 'supplierReqId.matchedBuyerId',
        foreignField: '_id',
        pipeline: [
          {
            $match: {
              $and: [{ active: { $eq: true } }],
            },
          },

          {
            $lookup: {
              from: 'suppliers',
              localField: 'userId',
              foreignField: '_id',
              as: 'suppliersData',
            },
          },
          {
            $unwind: '$suppliersData',
          },
        ],
        as: 'requirementsuppliersData',
      },
    },
    {
      $unwind: '$requirementsuppliersData',
    },

    {
      $project: {
        // data: '$supplierReqId',
        name: '$requirementsuppliersData.suppliersData.primaryContactName',
        secretName: '$requirementsuppliersData.suppliersData.secretName',
        createdBy: '$requirementsuppliersData.suppliersData.createdBy',
        requirementAddBy: '$requirementsuppliersData.requirementAddBy',
        product: '$requirementsuppliersData.product',
        buyerId: '$requirementsuppliersData._id',
        minrange: '$requirementsuppliersData.minrange',
        maxrange: '$requirementsuppliersData.maxrange',
        minprice: '$requirementsuppliersData.minprice',
        maxprice: '$requirementsuppliersData.maxprice',
        pdelivery: '$requirementsuppliersData.pdelivery',
        deliverylocation: '$requirementsuppliersData.deliverylocation',
        deliveryDate: '$requirementsuppliersData.deliveryDate',
        deliveryTime: '$requirementsuppliersData.deliveryTime',
        lat: '$requirementsuppliersData.lat',
        lang: '$requirementsuppliersData.lang',
        date: '$requirementsuppliersData.date',
        time: '$requirementsuppliersData.time',
        status: '$requirementsuppliersData.status',
        matchesStatus: '$requirementsuppliersData.matchesStatus',
        interestCount: '$requirementsuppliersData.interestCount',
        billId: '$requirementsuppliersData.billId',
        aliveFeedback: '$requirementsuppliersData.aliveFeedback',
        deadFeedback: '$requirementsuppliersData.deadFeedback',
        feedbackCallback: '$requirementsuppliersData.feedbackCallback',
        modificationFeedback: '$requirementsuppliersData.modificationFeedback',
        reasonCallback: '$requirementsuppliersData.reasonCallback',
        statusAccept: '$requirementsuppliersData.statusAccept',
        confirmCallStatus: '$requirementsuppliersData.confirmCallStatus',
        confirmCallStatusDate: '$requirementsuppliersData.confirmCallStatusDate',
        confirmCallStatusTime: '$requirementsuppliersData.confirmCallStatusTime',
        fixCallStatus: '$requirementsuppliersData.fixCallStatus',
        paymentCallStatus: '$requirementsuppliersData.paymentCallStatus',
        paymentConfirmCallStatus: '$requirementsuppliersData.paymentConfirmCallStatus',
      },
    },
  ]);

  return data;
};

// moderateHistory

const getModerateHistory = async (id) => {
  return SupplierModerateUpdate.aggregate([
    {
      $match: {
        $and: [{ supplierReqId: { $eq: id }, active: { $eq: true } }],
      },
    },
  ]);
};

// paymentHistory
const getPaymentHistory = async (id) => {
  return paymentData.aggregate([
    {
      $match: {
        $and: [{ buyerId: { $eq: id }, active: { $eq: true } }],
      },
    },
  ]);
};

// product match Buyer

const getBuyerSameProduct = async (id, page) => {
  let match = [{ matchedBuyerId: { $eq: id }, active: { $eq: true } }];
  const data = await RequirementBuyer.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'requirementsuppliers',
        localField: 'product',
        foreignField: 'product',
        pipeline: [
          {
            $match: {
              $and: [{ moderateStatus: { $eq: 'Moderated' } }],
            },
          },

          {
            $lookup: {
              from: 'supplierinterests',
              localField: '_id',
              foreignField: 'supplierReqId',
              pipeline: [
                {
                  $match: {
                    $and: match,
                  },
                },
              ],
              as: 'supplierReqId',
            },
          },
          {
            $lookup: {
              from: 'suppliers',
              localField: 'userId',
              foreignField: '_id',
              as: 'suppliersData',
            },
          },
          {
            $unwind: '$suppliersData',
          },
        ],
        as: 'requirementsuppliersData',
      },
    },
    {
      $unwind: '$requirementsuppliersData',
    },

    {
      $project: {
        name: '$suppliersData.primaryContactName',
        secretName: '$requirementsuppliersData.suppliersData.secretName',
        product: '$requirementsuppliersData.product',
        inte: '$requirementsuppliersData.supplierReqId',
        // inteDate: '$requirementsuppliersData.supplierReqId.interestDate',
        // inteTime: '$requirementsuppliersData.supplierReqId.interestTime',
        lat: '$requirementsuppliersData.lat',
        lang: '$requirementsuppliersData.lang',
        status: '$requirementsuppliersData.status',
        moderateStatus: '$requirementsuppliersData.moderateStatus',
        expectedQnty: '$requirementsuppliersData.expectedQnty',
        moderatedPrice: '$requirementsuppliersData.moderatedPrice',
        expectedQnty: '$requirementsuppliersData.expectedQnty',
        stockLocation: '$requirementsuppliersData.stockLocation',
        id: '$requirementsuppliersData._id',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await RequirementBuyer.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'requirementsuppliers',
        localField: 'product',
        foreignField: 'product',
        pipeline: [
          {
            $match: {
              $and: [{ moderateStatus: { $eq: 'Moderated' } }],
            },
          },

          {
            $lookup: {
              from: 'supplierinterests',
              localField: '_id',
              foreignField: 'supplierReqId',
              pipeline: [
                {
                  $match: {
                    $and: match,
                  },
                },
              ],
              as: 'supplierReqId',
            },
          },
          {
            $lookup: {
              from: 'suppliers',
              localField: 'userId',
              foreignField: '_id',
              as: 'suppliersData',
            },
          },
          {
            $unwind: '$suppliersData',
          },
        ],
        as: 'requirementsuppliersData',
      },
    },
    {
      $unwind: '$requirementsuppliersData',
    },
  ]);
  return { value: data, total: total.length };
};

// getallApprovedLiveStream
const getallApprovedLiveStream = async () => {
  const data = await RequirementSupplier.aggregate([
    {
      $match: {
        $and: [{ active: { $eq: true } }, { liveStreamStatus: { $eq: 'Approved' } }],
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliersData',
      },
    },
    {
      $unwind: '$suppliersData',
    },
    {
      $lookup: {
        from: 'requirementbuyers',
        localField: 'product',
        foreignField: 'product',
        as: 'buyersData',
      },
    },
    {
      $unwind: '$buyersData',
    },
    {
      $lookup: {
        from: 'livestreams',
        localField: '_id',
        foreignField: 'userId',
        as: 'livestreamsData',
      },
    },
    {
      $unwind: '$livestreamsData',
    },
    {
      $project: {
        name: '$suppliersData.primaryContactName',
        secretName: '$suppliersData.secretName',
        buyerId: '$buyersData._id',
        minrange: '$buyersData.minrange',
        maxrange: '$buyersData.maxrange',
        minprice: '$buyersData.minprice',
        maxprice: '$buyersData.maxprice',
        pdelivery: '$buyersData.pdelivery',
        deliverylocation: '$buyersData.deliverylocation',
        deliveryDate: '$buyersData.deliveryDate',
        deliveryTime: '$buyersData.deliveryTime',
        requirementAddBy: '$buyersData.requirementAddBy',
        date: '$buyersData.date',
        time: '$buyersData.time',
        lat: '$buyersData.lat',
        lang: '$buyersData.lang',
        status: '$buyersData.status',
        product: '$buyersData.product',
        status: '$buyersData.status',
        advance: '$buyersData.advance',
        statusAccept: '$buyersData.statusAccept',
        reasonCallback: '$buyersData.reasonCallback',
        dateCallback: '$buyersData.dateCallback',
        aliveFeedback: '$buyersData.aliveFeedback',
        deadFeedback: '$buyersData.deadFeedback',
        modificationFeedback: '$buyersData.modificationFeedback',
        feedbackCallback: '$buyersData.feedbackCallback',
        matchesStatus: '$buyersData.matchesStatus',
        interestCount: '$buyersData.interestCount',
        confirmCallStatus: '$buyersData.confirmCallStatus',
        confirmCallStatusDate: '$buyersData.confirmCallStatusDate',
        confirmCallStatusTime: '$buyersData.confirmCallStatusTime',
        fixCallStatus: '$buyersData.fixCallStatus',
        fixCallStatusDate: '$buyersData.fixCallStatusDate',
        fixCallStatusTime: '$buyersData.fixCallStatusTime',
        paymentCallStatus: '$buyersData.paymentCallStatus',
        paymentConfirmCallStatus: '$buyersData.paymentConfirmCallStatus',
        maximumlot: 1,
        minimumlot: 1,
        expectedQnty: 1,
        liveStreamData: '$livestreamsData',
      },
    },
  ]);
  return data;
};

// Buyer all live
const getBuyerAlive = async (page) => {
  let value = await RequirementBuyer.aggregate([
    {
      $match: {
        $and: [{ active: { $eq: true } }, { statusAccept: { $ne: 'Requirement dead' } }],
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliersData',
      },
    },
    {
      $unwind: '$suppliersData',
    },
    {
      $lookup: {
        from: 'supplierinterests',
        localField: '_id',
        foreignField: 'matchedBuyerId',
        pipeline: [{ $match: { $and: [{ active: { $eq: true } }] } }],
        as: 'supplierReqId',
      },
    },
    // {
    //   $unwind: '$supplierReqId',
    // },
    {
      $lookup: {
        from: 'supplierinterests',
        localField: '_id',
        foreignField: 'matchedBuyerId',
        pipeline: [{ $match: { $and: [{ shortlistStatus: { $eq: 'shortlist' }, active: { $eq: true } }] } }],
        as: 'supplierShort',
      },
    },
    {
      $lookup: {
        from: 'supplierinterests',
        localField: '_id',
        foreignField: 'matchedBuyerId',
        pipeline: [{ $match: { $and: [{ fixStatus: { $eq: 'fixed' }, active: { $eq: true } }] } }],
        as: 'supplierFixed',
      },
    },

    {
      $project: {
        name: '$suppliersData.primaryContactName',
        secretName: '$suppliersData.secretName',
        interest: { $size: '$supplierReqId' },
        totalPrice: '$supplierFixed',
        shortlist: { $size: '$supplierShort' },
        fixed: { $size: '$supplierFixed' },
        _id: 1,
        minrange: 1,
        maxrange: 1,
        minprice: 1,
        maxprice: 1,
        pdelivery: 1,
        deliverylocation: 1,
        deliveryDate: 1,
        deliveryTime: 1,
        requirementAddBy: 1,
        date: 1,
        time: 1,
        lat: 1,
        lang: 1,
        status: 1,
        product: 1,
        status: 1,
        advance: 1,
        statusAccept: 1,
        reasonCallback: 1,
        dateCallback: 1,
        aliveFeedback: 1,
        deadFeedback: 1,
        modificationFeedback: 1,
        feedbackCallback: 1,
        matchesStatus: 1,
        interestCount: 1,
        confirmCallStatus: 1,
        confirmCallStatusDate: 1,
        confirmCallStatusTime: 1,
        fixCallStatus: 1,
        fixCallStatusDate: 1,
        fixCallStatusTime: 1,
        paymentCallStatus: 1,
        paymentConfirmCallStatus: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await RequirementBuyer.aggregate([
    {
      $match: {
        $and: [{ active: { $eq: true } }, { statusAccept: { $ne: 'Requirement dead' } }],
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliersData',
      },
    },
    {
      $unwind: '$suppliersData',
    },
    {
      $lookup: {
        from: 'supplierinterests',
        localField: '_id',
        foreignField: 'matchedBuyerId',
        pipeline: [{ $match: { $and: [{ active: { $eq: true } }] } }],
        as: 'supplierReqId',
      },
    },
    // {
    //   $unwind: '$supplierReqId',
    // },
    {
      $lookup: {
        from: 'supplierinterests',
        localField: '_id',
        foreignField: 'matchedBuyerId',
        pipeline: [{ $match: { $and: [{ shortlistStatus: { $eq: 'shortlist' }, active: { $eq: true } }] } }],
        as: 'supplierShort',
      },
    },
    {
      $lookup: {
        from: 'supplierinterests',
        localField: '_id',
        foreignField: 'matchedBuyerId',
        pipeline: [{ $match: { $and: [{ fixStatus: { $eq: 'fixed' }, active: { $eq: true } }] } }],
        as: 'supplierFixed',
      },
    },
  ]);
  return { value: value, total: total.length };
};

// shortlist

const getBuyerShortList = async (id, page) => {
  const data = await RequirementBuyer.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'requirementsuppliers',
        localField: 'product',
        foreignField: 'product',
        pipeline: [
          {
            $match: {
              $and: [{ moderateStatus: { $eq: 'Moderated' } }],
            },
          },
          // {
          //   $lookup: {
          //     from: 'supplierinterests',
          //     localField:'_id',
          //     foreignField: 'supplierReqId',
          //     pipeline:[
          //              {$match:{$and:[{interestStatus:{$eq:"shortlist"}}]}},

          //          ],
          //     as: 'shortlist',
          //   },
          // },
          {
            $lookup: {
              from: 'supplierinterests',
              localField: '_id',
              foreignField: 'supplierReqId',
              pipeline: [
                {
                  $match: {
                    $or: [
                      { interestStatus: { $eq: 'interest' }, active: { $eq: true } },
                      { shortlistStatus: { $eq: 'shortlist' }, active: { $eq: true } },
                    ],
                  },
                },
              ],
              as: 'supplierReqId',
            },
          },
          {
            $unwind: '$supplierReqId',
          },
          {
            $lookup: {
              from: 'suppliers',
              localField: 'userId',
              foreignField: '_id',
              as: 'suppliersData',
            },
          },
          {
            $unwind: '$suppliersData',
          },
        ],
        as: 'requirementsuppliersData',
      },
    },
    {
      $unwind: '$requirementsuppliersData',
    },
    {
      $match: { $and: [{ 'requirementsuppliersData.supplierReqId.matchedBuyerId': { $eq: id } }] },
    },

    // {
    //   $lookup: {
    //     from: 'requirementsuppliers',
    //     localField: 'product',
    //     foreignField: 'product',
    //     as:'requirementsuppliersData',
    //   }
    // },
    // {
    //   $unwind: '$requirementsuppliersData',
    // },
    // {
    //   $lookup: {
    //     from: 'suppliers',
    //     localField: 'requirementsuppliersData.userId',
    //     foreignField: '_id',
    //     as: 'suppliersData',
    //   },
    // },
    // {
    //   $unwind: '$suppliersData',
    // },
    // {
    //   $lookup: {
    //     from: 'supplierinterests',
    //     localField:'requirementsuppliersData._id',
    //     foreignField:'supplierReqId',
    //     pipeline:[
    //       {$match:{$and:[{interestStatus:{$eq:"interest"}}]}},

    //   ],
    //     as: 'supplierinterestsData',
    //   },
    // },
    // {
    //   $unwind: '$supplierinterestsData',
    // },
    // {
    //   $lookup: {
    //     from: 'supplierinterests',
    //     localField:'_id',
    //     foreignField:'matchedBuyerId',
    //     pipeline:[
    //       {$match:{$and:[{interestStatus:{$eq:"shortlist"}}]}},

    //   ],
    //     as:'shortlist',
    //   },
    // },
    {
      $project: {
        name: '$suppliersData.primaryContactName',
        secretName: '$requirementsuppliersData.suppliersData.secretName',
        product: '$requirementsuppliersData.product',
        ghrfstatus: '$requirementsuppliersData.supplierReqId.interestStatus',
        shortliststatus: '$requirementsuppliersData.supplierReqId.shortlistStatus',
        callStatus: '$requirementsuppliersData.supplierReqId.callStatus',
        shortlistQuantity: '$requirementsuppliersData.supplierReqId.shortlistQuantity',
        interestId: '$requirementsuppliersData.supplierReqId._id',
        shortStatus: '$requirementsuppliersData.supplierReqId.shortStatus',
        interestDate: '$requirementsuppliersData.supplierReqId.interestDate',
        interestTime: '$requirementsuppliersData.supplierReqId.interestTime',
        shortDate: '$requirementsuppliersData.supplierReqId.shortDate',
        shortTime: '$requirementsuppliersData.supplierReqId.shortTime',
        totalPrice: '$requirementsuppliersData.supplierReqId.totalPrice',
        lat: '$requirementsuppliersData.lat',
        lang: '$requirementsuppliersData.lang',
        status: '$requirementsuppliersData.status',
        moderateStatus: '$requirementsuppliersData.moderateStatus',
        expectedQnty: '$requirementsuppliersData.expectedQnty',
        moderatedPrice: '$requirementsuppliersData.moderatedPrice',
        expectedQnty: '$requirementsuppliersData.expectedQnty',
        stockLocation: '$requirementsuppliersData.stockLocation',
        id: '$requirementsuppliersData._id',
      },
    },
    {
      $skip: 10 * page,
    },
    {
      $limit: 10,
    },
  ]);
  let total = await RequirementBuyer.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'requirementsuppliers',
        localField: 'product',
        foreignField: 'product',
        pipeline: [
          {
            $match: {
              $and: [{ moderateStatus: { $eq: 'Moderated' } }],
            },
          },
          // {
          //   $lookup: {
          //     from: 'supplierinterests',
          //     localField:'_id',
          //     foreignField: 'supplierReqId',
          //     pipeline:[
          //              {$match:{$and:[{interestStatus:{$eq:"shortlist"}}]}},

          //          ],
          //     as: 'shortlist',
          //   },
          // },
          {
            $lookup: {
              from: 'supplierinterests',
              localField: '_id',
              foreignField: 'supplierReqId',
              pipeline: [
                {
                  $match: {
                    $or: [
                      { interestStatus: { $eq: 'interest' }, active: { $eq: true } },
                      { shortlistStatus: { $eq: 'shortlist' }, active: { $eq: true } },
                    ],
                  },
                },
              ],
              as: 'supplierReqId',
            },
          },
          {
            $unwind: '$supplierReqId',
          },
          {
            $lookup: {
              from: 'suppliers',
              localField: 'userId',
              foreignField: '_id',
              as: 'suppliersData',
            },
          },
          {
            $unwind: '$suppliersData',
          },
        ],
        as: 'requirementsuppliersData',
      },
    },
    {
      $unwind: '$requirementsuppliersData',
    },
    {
      $match: { $and: [{ 'requirementsuppliersData.supplierReqId.matchedBuyerId': { $eq: id } }] },
    },
  ]);

  return { value: data, total: total.length };
};

// fixed

const getBuyerFixedList = async (id, page) => {
  const data = await RequirementBuyer.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'requirementsuppliers',
        localField: 'product',
        foreignField: 'product',
        pipeline: [
          {
            $match: {
              $and: [{ moderateStatus: { $eq: 'Moderated' } }],
            },
          },
          // {
          //   $lookup: {
          //     from: 'supplierinterests',
          //     localField:'_id',
          //     foreignField: 'supplierReqId',
          //     pipeline:[
          //              {$match:{$and:[{interestStatus:{$eq:"shortlist"}}]}},

          //          ],
          //     as: 'shortlist',
          //   },
          // },
          {
            $lookup: {
              from: 'supplierinterests',
              localField: '_id',
              foreignField: 'supplierReqId',
              pipeline: [
                {
                  $match: {
                    $or: [
                      { shortlistStatus: { $eq: 'shortlist' }, active: { $eq: true } },
                      { fixStatus: { $eq: 'fixed' }, active: { $eq: true } },
                    ],
                  },
                },
              ],
              as: 'supplierReqId',
            },
          },
          {
            $unwind: '$supplierReqId',
          },
          {
            $lookup: {
              from: 'suppliers',
              localField: 'userId',
              foreignField: '_id',
              as: 'suppliersData',
            },
          },
          {
            $unwind: '$suppliersData',
          },
        ],
        as: 'requirementsuppliersData',
      },
    },
    {
      $unwind: '$requirementsuppliersData',
    },
    {
      $match: { $and: [{ 'requirementsuppliersData.supplierReqId.matchedBuyerId': { $eq: id } }] },
    },
    {
      $project: {
        name: '$suppliersData.primaryContactName',
        secretName: '$requirementsuppliersData.suppliersData.secretName',
        product: '$requirementsuppliersData.product',
        shortliststatus: '$requirementsuppliersData.supplierReqId.shortlistStatus',
        fixedliststatus: '$requirementsuppliersData.supplierReqId.fixedStatus',
        callStatus: '$requirementsuppliersData.supplierReqId.callStatus',
        shortlistQuantity: '$requirementsuppliersData.supplierReqId.shortlistQuantity',
        interestId: '$requirementsuppliersData.supplierReqId._id',
        shortStatus: '$requirementsuppliersData.supplierReqId.shortStatus',
        shortDate: '$requirementsuppliersData.supplierReqId.shortDate',
        shortTime: '$requirementsuppliersData.supplierReqId.shortTime',
        fixStatus: '$requirementsuppliersData.supplierReqId.fixStatus',
        fixDate: '$requirementsuppliersData.supplierReqId.fixDate',
        fixTime: '$requirementsuppliersData.supplierReqId.fixTime',
        totalPrice: '$requirementsuppliersData.supplierReqId.totalPrice',
        supplierInterestTableId: '$requirementsuppliersData.supplierReqId._id',
        lat: '$requirementsuppliersData.lat',
        lang: '$requirementsuppliersData.lang',
        status: '$requirementsuppliersData.status',
        moderateStatus: '$requirementsuppliersData.moderateStatus',
        expectedQnty: '$requirementsuppliersData.expectedQnty',
        moderatedPrice: '$requirementsuppliersData.moderatedPrice',
        expectedQnty: '$requirementsuppliersData.expectedQnty',
        stockLocation: '$requirementsuppliersData.stockLocation',
        id: '$requirementsuppliersData._id',
      },
    },
    {
      $skip: 10 * page,
    },
    {
      $limit: 10,
    },
  ]);
  let total = await RequirementBuyer.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'requirementsuppliers',
        localField: 'product',
        foreignField: 'product',
        pipeline: [
          {
            $match: {
              $and: [{ moderateStatus: { $eq: 'Moderated' } }],
            },
          },
          // {
          //   $lookup: {
          //     from: 'supplierinterests',
          //     localField:'_id',
          //     foreignField: 'supplierReqId',
          //     pipeline:[
          //              {$match:{$and:[{interestStatus:{$eq:"shortlist"}}]}},

          //          ],
          //     as: 'shortlist',
          //   },
          // },
          {
            $lookup: {
              from: 'supplierinterests',
              localField: '_id',
              foreignField: 'supplierReqId',
              pipeline: [
                {
                  $match: {
                    $or: [
                      { shortlistStatus: { $eq: 'shortlist' }, active: { $eq: true } },
                      { fixStatus: { $eq: 'fixed' }, active: { $eq: true } },
                    ],
                  },
                },
              ],
              as: 'supplierReqId',
            },
          },
          {
            $unwind: '$supplierReqId',
          },
          {
            $lookup: {
              from: 'suppliers',
              localField: 'userId',
              foreignField: '_id',
              as: 'suppliersData',
            },
          },
          {
            $unwind: '$suppliersData',
          },
        ],
        as: 'requirementsuppliersData',
      },
    },
    {
      $unwind: '$requirementsuppliersData',
    },
    {
      $match: { $and: [{ 'requirementsuppliersData.supplierReqId.matchedBuyerId': { $eq: id } }] },
    },
  ]);

  return { value: data, total: total.length };
};

// fixed only
const getBuyerFixedOnly = async (id) => {
  const data = await RequirementBuyer.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'requirementsuppliers',
        localField: 'product',
        foreignField: 'product',
        pipeline: [
          {
            $match: {
              $and: [{ moderateStatus: { $eq: 'Moderated' } }],
            },
          },
          {
            $lookup: {
              from: 'supplierinterests',
              localField: '_id',
              foreignField: 'supplierReqId',
              pipeline: [{ $match: { $and: [{ fixStatus: { $eq: 'fixed' }, active: { $eq: true } }] } }],
              as: 'supplierReqId',
            },
          },
          {
            $unwind: '$supplierReqId',
          },
          {
            $lookup: {
              from: 'suppliers',
              localField: 'userId',
              foreignField: '_id',
              as: 'suppliersData',
            },
          },
          {
            $unwind: '$suppliersData',
          },
        ],
        as: 'requirementsuppliersData',
      },
    },
    {
      $unwind: '$requirementsuppliersData',
    },
    {
      $match: { $and: [{ 'requirementsuppliersData.supplierReqId.matchedBuyerId': { $eq: id } }] },
    },
    {
      $project: {
        name: '$suppliersData.primaryContactName',
        secretName: '$requirementsuppliersData.suppliersData.secretName',
        product: '$requirementsuppliersData.product',
        shortliststatus: '$requirementsuppliersData.supplierReqId.shortlistStatus',
        fixedliststatus: '$requirementsuppliersData.supplierReqId.fixedStatus',
        callStatus: '$requirementsuppliersData.supplierReqId.callStatus',
        shortlistQuantity: '$requirementsuppliersData.supplierReqId.shortlistQuantity',
        interestId: '$requirementsuppliersData.supplierReqId._id',
        shortStatus: '$requirementsuppliersData.supplierReqId.shortStatus',
        shortDate: '$requirementsuppliersData.supplierReqId.shortDate',
        shortTime: '$requirementsuppliersData.supplierReqId.shortTime',
        fixStatus: '$requirementsuppliersData.supplierReqId.fixStatus',
        fixDate: '$requirementsuppliersData.supplierReqId.fixDate',
        fixTime: '$requirementsuppliersData.supplierReqId.fixTime',
        totalPrice: '$requirementsuppliersData.supplierReqId.totalPrice',
        lat: '$requirementsuppliersData.lat',
        lang: '$requirementsuppliersData.lang',
        status: '$requirementsuppliersData.status',
        moderateStatus: '$requirementsuppliersData.moderateStatus',
        expectedQnty: '$requirementsuppliersData.expectedQnty',
        moderatedPrice: '$requirementsuppliersData.moderatedPrice',
        expectedQnty: '$requirementsuppliersData.expectedQnty',
        stockLocation: '$requirementsuppliersData.stockLocation',
        id: '$requirementsuppliersData._id',
      },
    },
  ]);

  return data;
};

// updated data get method
const getUpdateDataQty = async (id) => {
  const data = SupplierRequirementUpdate.find({ supplierReqId: id });
  return data;
};

const getUpdateDataBuyerQty = async (id) => {
  const data = BuyerRequirementUpdate.find({ buyerReqId: id });
  return data;
};

const getModeratedata = async (id) => {
  const data = SupplierModerateUpdate.find({ supplierReqId: id });
  return data;
};
const updateRequirementBuyerById = async (buyerId, updateBody) => {
  let data = await getByIdBuyer(buyerId);
  let values = {};
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementBuyer not found');
  }
  if (
    data[0].minrange != updateBody.minrange &&
    data[0].minprice == updateBody.minprice &&
    data[0].maxprice == updateBody.maxprice &&
    data[0].deliverylocation == updateBody.deliverylocation
  ) {
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        QtyMin: data[0].minrange,
        QtyMax: data[0].maxrange,
        date: data[0].date,
        time: data[0].time,
      },
    };
    // console.log("1")
  }
  if (
    data[0].maxrange != updateBody.maxrange &&
    data[0].minprice == updateBody.minprice &&
    data[0].maxprice == updateBody.maxprice &&
    data[0].deliverylocation == updateBody.deliverylocation
  ) {
    // console.log("2")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        QtyMin: data[0].minrange,
        QtyMax: data[0].maxrange,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }
  if (
    data[0].minprice != updateBody.minprice &&
    data[0].minrange == updateBody.minrange &&
    data[0].maxrange == updateBody.maxrange &&
    data[0].deliverylocation == updateBody.deliverylocation
  ) {
    // console.log("3")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        priceMin: data[0].minprice,
        priceMax: data[0].maxprice,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }
  if (
    data[0].maxprice != updateBody.maxprice &&
    data[0].minrange == updateBody.minrange &&
    data[0].maxrange == updateBody.maxrange &&
    data[0].deliverylocation == updateBody.deliverylocation
  ) {
    // console.log("4")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        priceMin: data[0].minprice,
        priceMax: data[0].maxprice,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }
  if (
    data[0].maxprice != updateBody.maxprice &&
    data[0].minrange != updateBody.minrange &&
    data[0].deliverylocation == updateBody.deliverylocation
  ) {
    // console.log("01")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        priceMin: data[0].minprice,
        priceMax: data[0].maxprice,
        QtyMin: data[0].minrange,
        QtyMax: data[0].maxrange,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }
  if (
    data[0].maxprice != updateBody.maxprice &&
    data[0].maxrange != updateBody.maxrange &&
    data[0].deliverylocation == updateBody.deliverylocation
  ) {
    // console.log("02")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        priceMin: data[0].minprice,
        priceMax: data[0].maxprice,
        QtyMin: data[0].minrange,
        QtyMax: data[0].maxrange,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }
  if (
    data[0].minprice != updateBody.minprice &&
    data[0].minrange != updateBody.minrange &&
    data[0].deliverylocation == updateBody.deliverylocation
  ) {
    // console.log("03")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        priceMin: data[0].minprice,
        priceMax: data[0].maxprice,
        QtyMin: data[0].minrange,
        QtyMax: data[0].maxrange,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }
  if (
    data[0].minprice != updateBody.minprice &&
    data[0].maxrange != updateBody.maxrange &&
    data[0].deliverylocation == updateBody.deliverylocation
  ) {
    // console.log("404")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        priceMin: data[0].minprice,
        priceMax: data[0].maxprice,
        QtyMin: data[0].minrange,
        QtyMax: data[0].maxrange,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }

  if (
    data[0].deliverylocation != updateBody.deliverylocation &&
    data[0].minrange == updateBody.minrange &&
    data[0].maxrange == updateBody.maxrange &&
    data[0].minprice == updateBody.minprice &&
    data[0].maxprice == updateBody.maxprice
  ) {
    // console.log("5")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        deliveryLocation: data[0].deliverylocation,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }
  if (
    data[0].deliverylocation != updateBody.deliverylocation &&
    data[0].minrange != updateBody.minrange &&
    data[0].minprice == updateBody.minprice &&
    data[0].maxprice == updateBody.maxprice
  ) {
    // console.log("6")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        QtyMin: data[0].minrange,
        QtyMax: data[0].maxrange,
        deliveryLocation: data[0].deliverylocation,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }
  if (
    data[0].deliverylocation != updateBody.deliverylocation &&
    data[0].maxrange != updateBody.maxrange &&
    data[0].minprice == updateBody.minprice &&
    data[0].maxprice == updateBody.maxprice
  ) {
    // console.log("7")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        QtyMin: data[0].minrange,
        QtyMax: data[0].maxrange,
        deliveryLocation: data[0].deliverylocation,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }
  if (
    data[0].deliverylocation != updateBody.deliverylocation &&
    data[0].minprice != updateBody.minprice &&
    data[0].minrange == updateBody.minrange &&
    data[0].maxrange == updateBody.maxrange
  ) {
    // console.log("8")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        priceMin: data[0].minprice,
        priceMax: data[0].maxprice,
        deliveryLocation: data[0].deliverylocation,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }
  if (
    data[0].deliverylocation != updateBody.deliverylocation &&
    data[0].maxprice != updateBody.maxprice &&
    data[0].minrange == updateBody.minrange &&
    data[0].maxrange == updateBody.maxrange
  ) {
    // console.log("9")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        priceMin: data[0].minprice,
        priceMax: data[0].maxprice,
        deliveryLocation: data[0].deliverylocation,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }
  if (
    data[0].deliverylocation != updateBody.deliverylocation &&
    data[0].minrange != updateBody.minrange &&
    data[0].minprice != updateBody.minprice
  ) {
    // console.log("10")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        QtyMin: data[0].minrange,
        QtyMax: data[0].maxrange,
        priceMin: data[0].minprice,
        priceMax: data[0].maxprice,
        deliveryLocation: data[0].deliverylocation,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }
  if (
    data[0].deliverylocation != updateBody.deliverylocation &&
    data[0].maxrange != updateBody.maxrange &&
    data[0].maxprice != updateBody.maxprice
  ) {
    // console.log("11")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        QtyMin: data[0].minrange,
        QtyMax: data[0].maxrange,
        priceMin: data[0].minprice,
        priceMax: data[0].maxprice,
        deliveryLocation: data[0].deliverylocation,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }
  if (
    data[0].deliverylocation != updateBody.deliverylocation &&
    data[0].minrange != updateBody.minrange &&
    data[0].maxprice != updateBody.maxprice
  ) {
    // console.log("12")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        QtyMin: data[0].minrange,
        QtyMax: data[0].maxrange,
        priceMin: data[0].minprice,
        priceMax: data[0].maxprice,
        deliveryLocation: data[0].deliverylocation,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }
  if (
    data[0].deliverylocation != updateBody.deliverylocation &&
    data[0].maxrange != updateBody.maxrange &&
    data[0].minprice != updateBody.minprice
  ) {
    // console.log("13")
    values = {
      ...{
        userId: data[0].userId,
        buyerReqId: data[0]._id,
        QtyMin: data[0].minrange,
        QtyMax: data[0].maxrange,
        priceMin: data[0].minprice,
        priceMax: data[0].maxprice,
        deliveryLocation: data[0].deliverylocation,
        date: data[0].date,
        time: data[0].time,
      },
    };
  }
  //  console.log(values)
  if (Object.keys(values).length !== 0) {
    BuyerRequirementUpdate.create(values);
  }
  data = await RequirementBuyer.findByIdAndUpdate({ _id: buyerId }, updateBody, { new: true });

  return data;
};

const updateRequirementSupplierById = async (supplierId, updateBody) => {
  let data = await getByIdSupplier(supplierId);
  let values1 = {};
  let values = {};
  let interestValues = {};

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementSupplier not found');
  }
  if (updateBody.supplierInterest) {
    interestValues = {
      ...{
        userId: data[0].userId,
        supplierReqId: data[0]._id,
        matchedBuyerId: updateBody.matchedBuyerId,
        interestStatus: updateBody.supplierInterest,
      },
    };
  }
  if (data[0].moderatedPrice != null && updateBody.moderatedPrice) {
    if (updateBody.moderatedPrice != data[0].moderatedPrice) {
      // console.log('yes');
      values1 = {
        ...{
          userId: data[0].userId,
          supplierReqId: data[0]._id,
          moderatedPrice: data[0].moderatedPrice,
          date: data[0].moderateDate,
          time: data[0].moderateTime,
        },
      };
    }
  }

  if (updateBody.expectedQnty) {
    if (
      data[0].expectedQnty != updateBody.expectedQnty &&
      data[0].expectedPrice == updateBody.expectedPrice &&
      data[0].stockLocation == updateBody.stockLocation
    ) {
      values = {
        ...{
          userId: data[0].userId,
          supplierReqId: data[0]._id,
          updatedQty: data[0].expectedQnty,
          date: data[0].date,
          time: data[0].time,
        },
      };
    }
  }
  if (updateBody.expectedPrice) {
    if (
      data[0].expectedPrice != updateBody.expectedPrice &&
      data[0].expectedQnty == updateBody.expectedQnty &&
      data[0].stockLocation == updateBody.stockLocation
    ) {
      values = {
        ...{
          userId: data[0].userId,
          supplierReqId: data[0]._id,
          price: data[0].expectedPrice,
          date: data[0].date,
          time: data[0].time,
        },
      };
    }
  }
  if (updateBody.stockLocation) {
    if (
      data[0].stockLocation != updateBody.stockLocation &&
      data[0].expectedQnty == updateBody.expectedQnty &&
      data[0].expectedPrice == updateBody.expectedPrice
    ) {
      values = {
        ...{
          userId: data[0].userId,
          supplierReqId: data[0]._id,
          stockLocation: data[0].stockLocation,
          date: data[0].date,
          time: data[0].time,
        },
      };
    }
  }
  if (updateBody.expectedQnty && updateBody.expectedPrice) {
    if (
      data[0].expectedQnty != updateBody.expectedQnty &&
      data[0].expectedPrice != updateBody.expectedPrice &&
      data[0].stockLocation == updateBody.stockLocation
    ) {
      console.log(updateBody.expectedQnty);
      values = {
        ...{
          userId: data[0].userId,
          supplierReqId: data[0]._id,
          updatedQty: data[0].expectedQnty,
          price: data[0].expectedPrice,
          date: data[0].date,
          time: data[0].time,
        },
      };
    }
  }
  if (updateBody.expectedQnty && updateBody.stockLocation) {
    if (
      data[0].expectedQnty != updateBody.expectedQnty &&
      data[0].stockLocation != updateBody.stockLocation &&
      data[0].expectedPrice == updateBody.expectedPrice
    ) {
      values = {
        ...{
          userId: data[0].userId,
          supplierReqId: data[0]._id,
          updatedQty: data[0].expectedQnty,
          stockLocation: data[0].stockLocation,
          date: data[0].date,
          time: data[0].time,
        },
      };
    }
  }
  if (updateBody.expectedPrice && updateBody.stockLocation) {
    if (
      data[0].expectedPrice != updateBody.expectedPrice &&
      data[0].stockLocation != updateBody.stockLocation &&
      data[0].expectedQnty == updateBody.expectedQnty
    ) {
      values = {
        ...{
          userId: data[0].userId,
          supplierReqId: data[0]._id,
          price: data[0].expectedPrice,
          stockLocation: data[0].stockLocation,
          date: data[0].date,
          time: data[0].time,
        },
      };
    }
  }
  if (updateBody.expectedPrice && updateBody.stockLocation && updateBody.expectedQnty) {
    if (
      data[0].expectedPrice != updateBody.expectedPrice &&
      data[0].stockLocation != updateBody.stockLocation &&
      data[0].expectedQnty != updateBody.expectedQnty
    ) {
      values = {
        ...{
          userId: data[0].userId,
          supplierReqId: data[0]._id,
          price: data[0].expectedPrice,
          updatedQty: data[0].expectedQnty,
          stockLocation: data[0].stockLocation,
          date: data[0].date,
          time: data[0].time,
        },
      };
    }
  }

  if (Object.keys(values).length !== 0) {
    SupplierRequirementUpdate.create(values);
  }
  if (Object.keys(values1).length !== 0) {
    SupplierModerateUpdate.create(values1);
  }

  if (Object.keys(interestValues).length !== 0) {
    SupplierInterest.create(interestValues);
  }
  data = await RequirementSupplier.findByIdAndUpdate({ _id: supplierId }, updateBody, { new: true });
  return data;
};
const getbyId = async (buyerId) => {
  const data = await RequirementBuyer.findById(buyerId);
  if (!data || data.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementBuyer not found');
  }
  return data;
};

const deleteRequirementBuyerById = async (buyerId) => {
  const data = await getbyId(buyerId);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementBuyer not found');
  }
  (data.active = false), (data.archive = true), await data.save();
  return data;
};

const deleteRequirementSupplierById = async (supplierId) => {
  const data = await getByIdSupplier(supplierId);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RequirementSupplier not found');
  }
  (data.active = false), (data.archive = true), await data.save();
  return data;
};

// get alll data liveStream

const getAllLiveStreamData = async () => {
  const data = await RequirementSupplier.aggregate([
    {
      $match: {
        $and: [{ liveStreamDate: { $ne: null } }, { liveStreamDate: { $ne: '' } }, { active: { $eq: true } }],
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliersData',
      },
    },
    {
      $unwind: '$suppliersData',
    },
    {
      $project: {
        name: '$suppliersData.primaryContactName',
        secretName: '$suppliersData.secretName',
        _id: 1,
        userId: 1,
        product: 1,
        stockLocation: 1,
        stockPosition: 1,
        packType: 1,
        expectedPrice: 1,
        expectedQnty: 1,
        paymentMode: 1,
        requirementAddBy: 1,
        stockAvailabilityDate: 1,
        stockAvailabilityTime: 1,
        date: 1,
        time: 1,
        lat: 1,
        lang: 1,
        status: 1,
        advance: 1,
        status: 1,
        advance: 1,
        statusAccept: 1,
        reasonCallback: 1,
        dateCallback: 1,
        aliveFeedback: 1,
        deadFeedback: 1,
        modificationFeedback: 1,
        feedbackCallback: 1,
        moderatedPrice: 1,
        moderateStatus: 1,
        moderateTime: 1,
        moderateDate: 1,
        liveStreamDate: 1,
        liveStreamTime: 1,
        liveStreamStatus: 1,
        liveStreamReason: 1,
      },
    },
  ]);
  return data;
};

// getdataLiveStreamReject
const getdataLiveStreamReject = async (userId) => {
  const data = await RequirementSupplier.aggregate([
    {
      $match: {
        $and: [
          { userId: { $eq: userId } },
          { liveStreamDate: { $ne: null } },
          { liveStreamStatus: { $eq: 'Rejected' } },
          { liveStreamDate: { $ne: '' } },
          { active: { $eq: true } },
        ],
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliersData',
      },
    },
    {
      $unwind: '$suppliersData',
    },
    {
      $project: {
        name: '$suppliersData.primaryContactName',
        secretName: '$suppliersData.secretName',
        _id: 1,
        userId: 1,
        product: 1,
        stockLocation: 1,
        stockPosition: 1,
        packType: 1,
        expectedPrice: 1,
        expectedQnty: 1,
        paymentMode: 1,
        requirementAddBy: 1,
        stockAvailabilityDate: 1,
        stockAvailabilityTime: 1,
        date: 1,
        time: 1,
        lat: 1,
        lang: 1,
        status: 1,
        advance: 1,
        status: 1,
        advance: 1,
        statusAccept: 1,
        reasonCallback: 1,
        dateCallback: 1,
        aliveFeedback: 1,
        deadFeedback: 1,
        modificationFeedback: 1,
        feedbackCallback: 1,
        moderatedPrice: 1,
        moderateStatus: 1,
        moderateTime: 1,
        moderateDate: 1,
        liveStreamDate: 1,
        liveStreamTime: 1,
        liveStreamStatus: 1,
        liveStreamReason: 1,
      },
    },
  ]);
  return data;
};

// getdataLiveStreamApproved
const getdataLiveStreamApproved = async (userId) => {
  const data = await RequirementSupplier.aggregate([
    {
      $match: {
        $and: [
          { userId: { $eq: userId } },
          { liveStreamDate: { $ne: null } },
          { liveStreamStatus: { $eq: 'Approved' } },
          { liveStreamDate: { $ne: '' } },
          { active: { $eq: true } },
        ],
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliersData',
      },
    },
    {
      $unwind: '$suppliersData',
    },
    {
      $project: {
        name: '$suppliersData.primaryContactName',
        secretName: '$suppliersData.secretName',
        _id: 1,
        userId: 1,
        product: 1,
        stockLocation: 1,
        stockPosition: 1,
        packType: 1,
        expectedPrice: 1,
        expectedQnty: 1,
        paymentMode: 1,
        requirementAddBy: 1,
        stockAvailabilityDate: 1,
        stockAvailabilityTime: 1,
        date: 1,
        time: 1,
        lat: 1,
        lang: 1,
        status: 1,
        advance: 1,
        status: 1,
        advance: 1,
        statusAccept: 1,
        reasonCallback: 1,
        dateCallback: 1,
        aliveFeedback: 1,
        deadFeedback: 1,
        modificationFeedback: 1,
        feedbackCallback: 1,
        moderatedPrice: 1,
        moderateStatus: 1,
        moderateTime: 1,
        moderateDate: 1,
        liveStreamDate: 1,
        liveStreamTime: 1,
        liveStreamStatus: 1,
        liveStreamReason: 1,
      },
    },
  ]);
  return data;
};

const getCalculatedQuantity = async (id) => {
  let values = await liveStreamModel.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'streamingdatas',
        localField: 'requirementId',
        foreignField: 'productId',
        pipeline: [{ $group: { _id: null, Qty: { $sum: '$streamFixedQuantity' } } }],
        as: 'datas',
      },
    },
    {
      $unwind: '$datas',
    },
    {
      $project: {
        userId: 1,
        requirementId: 1,
        expectedQnty: 1,
        totalQuantity: '$datas.Qty',
      },
    },
    {
      $project: {
        BalanceStock: {
          $subtract: ['$expectedQnty', '$totalQuantity'],
        },
      },
    },
  ]);
  return values;
};

module.exports = {
  createRequirementBuyer,
  createRequirementSupplier,
  getByIdBuyer,
  getByIdSupplier,
  getByIdBuyerAll,
  getByIdSupplierAll,
  updateRequirementBuyerById,
  updateRequirementSupplierById,
  deleteRequirementBuyerById,
  deleteRequirementSupplierById,
  getUpdateDataQty,
  getUpdateDataBuyerQty,
  getModeratedata,
  getBuyerAlive,
  getBuyerSameProduct,
  getBuyerShortList,
  getBuyerFixedList,
  getBuyerFixedOnly,
  getModerateHistory,
  getPaymentHistory,
  getSupplierSameProduct,
  getSupplierInterestBuyer,
  getProductAllApi,
  getAllBuyerProduct,
  getAllLiveStreamData,
  getdataLiveStreamReject,
  getdataLiveStreamApproved,
  getallApprovedLiveStream,
  getProductDateByProductName,
  createArrayData,
  getCalculatedQuantity,
};
