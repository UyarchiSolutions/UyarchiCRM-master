const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const liveStream = require('../models/liveStream.model');
const Agora = require('agora-access-token');
const { RequirementBuyer, RequirementSupplier } = require('../models/requirementCollectionBS.model');

const createLiveStream = async (userBody) => {
  console.log(userBody);

  const appID = 'dd80ee642fa84a36a365f560c3741929';
  const appCertificate = '7861826a7d6547238a845836b0442d8e';

  // const user = req.body.user;
  // const role = Agora.RtmRole.Rtm_User;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  console.log(currentTimestamp);
  const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;
  const token = Agora.RtmTokenBuilder.buildToken(appID, appCertificate, userBody.requirementId, expirationTimestamp);
  return liveStream.create({
    token: token,
    userId: userBody.userId,
    requirementId: userBody.requirementId,
    expectedQnty: userBody.expectedQnty,
  });
};

const getliveStream = async (id) => {
  const data = await liveStream.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'requirementsuppliers',
        localField: 'requirementId',
        foreignField: '_id',
        as: 'requirementsuppliers',
      },
    },
    { $unwind: '$requirementsuppliers' },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliers',
      },
    },
    { $unwind: '$suppliers' },
    {
      $project: {
        liveStreamDate: '$requirementsuppliers.liveStreamDate',
        requirementID: '$requirementsuppliers._id',
        liveStreamTime: '$requirementsuppliers.liveStreamTime',
        liveStream_To_Time: '$requirementsuppliers.liveStream_To_Time',
        date: '$requirementsuppliers.date',
        product: '$requirementsuppliers.product',
        expectedPrice: '$requirementsuppliers.expectedPrice',
        expectedQnty: '$requirementsuppliers.expectedQnty',
        billId: '$requirementsuppliers.billId',
        minimumlot: '$requirementsuppliers.minimumlot',
        maximumlot: '$requirementsuppliers.maximumlot',
        userId: 1,
        secretName: '$suppliers.secretName',
        adminAprove: 1,
        streaming: 1,
        active_Buyer: 1,
        confirm: 1,
        expiry: 1,
        token: 1,
        liveConfirm: 1,
      },
    },
  ]);

  return data;
};
const getAllliveStriming = async (page) => {
  const data = await liveStream.aggregate([
    {
      $lookup: {
        from: 'requirementsuppliers',
        localField: 'requirementId',
        foreignField: '_id',
        as: 'requirementsuppliers',
      },
    },
    { $unwind: '$requirementsuppliers' },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliers',
      },
    },
    { $unwind: '$suppliers' },
    {
      $project: {
        liveStreamDate: '$requirementsuppliers.liveStreamDate',
        requirementID: '$requirementsuppliers._id',
        liveStreamTime: '$requirementsuppliers.liveStreamTime',
        date: '$requirementsuppliers.date',
        liveStream_To_Time: '$requirementsuppliers.liveStream_To_Time',
        product: '$requirementsuppliers.product',
        billId: '$requirementsuppliers.billId',
        userId: 1,
        secretName: '$suppliers.secretName',
        SupplierName: '$suppliers.primaryContactName',
        adminAprove: 1,
        streaming: 1,
        expiry: 1,
      },
    },
    {
      $skip: 10 * page,
    },
    {
      $limit: 10,
    },
  ]);
  let total = await liveStream.aggregate([
    {
      $lookup: {
        from: 'requirementsuppliers',
        localField: 'requirementId',
        foreignField: '_id',
        as: 'requirementsuppliers',
      },
    },
    { $unwind: '$requirementsuppliers' },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliers',
      },
    },
    { $unwind: '$suppliers' },
  ]);
  return { value: data, total: total.length };
};
const updatetoken = async (id, bodydata) => {
  const data = await liveStream.findByIdAndUpdate({ _id: id }, bodydata, { new: true });
  return data;
};

const getAllliveStrimingapproved = async (id) => {
  const data = await liveStream.aggregate([
    {
      $match: {
        $and: [{ adminAprove: { $eq: 'Approved' } }, { userId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'requirementsuppliers',
        localField: 'requirementId',
        foreignField: '_id',
        as: 'requirementsuppliers',
      },
    },
    { $unwind: '$requirementsuppliers' },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliers',
      },
    },
    { $unwind: '$suppliers' },
    {
      $project: {
        liveStreamDate: '$requirementsuppliers.liveStreamDate',
        requirementID: '$requirementsuppliers._id',
        liveStreamTime: '$requirementsuppliers.liveStreamTime',
        liveStream_To_Time: '$requirementsuppliers.liveStream_To_Time',
        date: '$requirementsuppliers.date',
        product: '$requirementsuppliers.product',
        expectedPrice: '$requirementsuppliers.expectedPrice',
        expectedQnty: '$requirementsuppliers.expectedQnty',
        billId: '$requirementsuppliers.billId',
        userId: 1,
        secretName: '$suppliers.secretName',
        adminAprove: 1,
        streaming: 1,
        expiry: 1,
      },
    },
  ]);
  return data;
};
const getBuyerWatch = async (id) => {
  // console.log(id)
  const data = await liveStream.aggregate([
    {
      $match: {
        $and: [{ adminAprove: { $eq: 'Approved' } }, { streaming: { $eq: 'Online' } }, { expiry: { $eq: true } }],
      },
    },
    {
      $lookup: {
        from: 'requirementsuppliers',
        localField: 'requirementId',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'requirementbuyers',
              localField: 'product',
              foreignField: 'product',
              pipeline: [{ $match: { userId: id } }],
              as: 'requirementbuyers',
            },
          },
          { $unwind: '$requirementbuyers' },
        ],
        as: 'requirementsuppliers',
      },
    },
    { $unwind: '$requirementsuppliers' },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliers',
      },
    },
    { $unwind: '$suppliers' },
    {
      $project: {
        liveStreamDate: '$requirementsuppliers.liveStreamDate',
        requirementID: '$requirementsuppliers._id',
        liveStreamTime: '$requirementsuppliers.liveStreamTime',
        date: '$requirementsuppliers.date',
        product: '$requirementsuppliers.product',
        expectedPrice: '$requirementsuppliers.expectedPrice',
        expectedQnty: '$requirementsuppliers.expectedQnty',
        billId: '$requirementsuppliers.billId',
        minimumlot: '$requirementsuppliers.minimumlot',
        maximumlot: '$requirementsuppliers.maximumlot',
        userId: 1,
        secretName: '$suppliers.secretName',
        adminAprove: 1,
        streaming: 1,
        expiry: 1,
        _id: 1,
        confirm: 1,
      },
    },
  ]);
  return data;
};

const getAllBuyerMatch = async (id) => {
  const data = await liveStream.aggregate([
    {
      $match: {
        $and: [{ adminAprove: { $eq: 'Approved' } }],
      },
    },
    {
      $match: {
        $and: [{ requirementId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'requirementsuppliers',
        localField: 'requirementId',
        foreignField: '_id',
        as: 'requirementsuppliers',
      },
    },
    { $unwind: '$requirementsuppliers' },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'userId',
        foreignField: '_id',
        as: 'suppliers',
      },
    },
    { $unwind: '$suppliers' },
    {
      $lookup: {
        from: 'requirementbuyers',
        localField: 'requirementsuppliers.product',
        foreignField: 'product',
        as: 'requirementbuyersData',
      },
    },
    { $unwind: '$requirementbuyersData' },
    {
      $project: {
        liveStreamDate: '$requirementsuppliers.liveStreamDate',
        requirementID: '$requirementsuppliers._id',
        liveStreamTime: '$requirementsuppliers.liveStreamTime',
        date: '$requirementsuppliers.date',
        product: '$requirementsuppliers.product',
        expectedPrice: '$requirementsuppliers.expectedPrice',
        expectedQnty: '$requirementsuppliers.expectedQnty',
        billId: '$requirementsuppliers.billId',
        userId: 1,
        secretName: '$suppliers.secretName',
        adminAprove: 1,
        streaming: 1,
        expiry: 1,
        token: 1,
        _id: 1,
        buyerData: '$requirementbuyersData',
      },
    },
  ]);
  return data;
};

const getAllSUpplierMatch = async (id) => {
  let arr = [];
  const dat = await RequirementBuyer.find({ userId: id });
  for (let i = 0; i < dat.length; i++) {
    const data = await RequirementBuyer.aggregate([
      // {
      //   $match: {
      //     $and: [{ adminAprove: { $eq: "Approved" } }],
      //   },
      // },
      {
        $match: {
          $and: [{ _id: { $eq: dat[i]._id } }, { active: { $eq: true } }],
        },
      },
      {
        $lookup: {
          from: 'requirementsuppliers',
          localField: 'product',
          foreignField: 'product',
          as: 'requirementsuppliers',
        },
      },
      { $unwind: '$requirementsuppliers' },
      {
        $lookup: {
          from: 'suppliers',
          localField: 'userId',
          foreignField: '_id',
          as: 'suppliers',
        },
      },
      { $unwind: '$suppliers' },
      {
        $lookup: {
          from: 'livestreams',
          localField: 'requirementsuppliers._id',
          foreignField: 'requirementId',
          as: 'livestreamsData',
        },
      },
      { $unwind: '$livestreamsData' },
      {
        $match: {
          $and: [{ 'livestreamsData.adminAprove': { $eq: 'Approved' } }],
        },
      },
      {
        $project: {
          // liveStreamDate: "$requirementsuppliers.liveStreamDate",
          // requirementID: "$requirementsuppliers._id",
          // liveStreamTime: "$requirementsuppliers.liveStreamTime",
          // date: "$requirementsuppliers.date",
          // product: "$requirementsuppliers.product",
          // expectedPrice: "$requirementsuppliers.expectedPrice",
          // expectedQnty: "$requirementsuppliers.expectedQnty",
          // billId: "$requirementsuppliers.billId",
          // userId: 1,
          secretName: '$suppliers.secretName',
          adminAprove: '$livestreamsData.adminAprove',
          streaming: '$livestreamsData.streaming',
          expiry: '$livestreamsData.expiry',
          token: '$livestreamsData.token',
          supplierData: '$requirementsuppliers',
        },
      },
    ]);
    arr.push(data[0]);
  }
  return arr;
};

const getById = async (id) => {
  return liveStream.findById(id);
};

const updateBuyerId = async (id, updateBody) => {
  let Manage = await getById(id);
  console.log(Manage);
  if (!Manage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'livestreamData not found');
  }
  Manage = await liveStream.findByIdAndUpdate({ _id: id }, { $push: { confirm: updateBody.confirm } }, { new: true });
  return Manage;
};

const updateRejectData = async (id, updateBody) => {
  let Manage = await getById(id);
  let time = moment().format('HHmmss');
  let serverdate = moment().format('yyyy-MM-DD');
  if (!Manage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'livestreamData not found');
  }
  Manage = await liveStream.findByIdAndUpdate(
    { _id: id },
    { rejectDate: serverdate, rejectTime: time, adminAprove: updateBody.adminAprove, reason: updateBody.reason },
    { new: true }
  );
  return Manage;
};

const getallRejected = async (userId) => {
  return liveStream.aggregate([
    {
      $match: {
        $and: [{ userId: { $eq: userId } }, { adminAprove: { $eq: 'Rejected' } }],
      },
    },
    {
      $lookup: {
        from: 'requirementsuppliers',
        localField: 'requirementId',
        foreignField: '_id',
        as: 'requirementsuppliersData',
      },
    },
    { $unwind: '$requirementsuppliersData' },
    {
      $project: {
        product: '$requirementsuppliersData.product',
        adminAprove: 1,
        streaming: 1,
        expiry: 1,
        token: 1,
        confirm: 1,
        active_Buyer: 1,
        userId: 1,
        requirementId: 1,
        rejectDate: 1,
        rejectTime: 1,
        reason: 1,
      },
    },
  ]);
};

const remove_specific_buyer = async (id, body) => {
  const { buyerId } = body;
  let liveStreams = await liveStream.findById(id);
  if (!liveStreams) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }
  await liveStream.update({ _id: id }, { $pull: { active_Buyer: buyerId } }, { new: true });
  let afterupdate = await liveStream.findById(id);
  return afterupdate;
};

const send_Active_Buyer = async (id, body) => {
  const { buyerId } = body;
  let liveStreams = await liveStream.findById(id);
  if (!liveStreams) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await liveStream.update({ _id: id }, { $push: { active_Buyer: buyerId } });
  let afterupdate = await liveStream.findById(id);
  return afterupdate;
};

module.exports = {
  createLiveStream,
  getliveStream,
  getAllliveStriming,
  updatetoken,
  getAllliveStrimingapproved,
  getBuyerWatch,
  getAllBuyerMatch,
  getAllSUpplierMatch,
  updateBuyerId,
  updateRejectData,
  getallRejected,
  remove_specific_buyer,
  send_Active_Buyer,
};
