const httpStatus = require('http-status');
const { Host, HostProduct, HostStreaming} = require('../models/hostreg.model');
const ApiError = require('../utils/ApiError');
const Agora = require('agora-access-token');
const moment = require('moment');

const createHost = async (body) => {
  return Host.create(body);
};

const loginhostEmailAndPassword = async (email, mobileNumber) => {
  const data = await Host.findOne({ email: email });
  if (data != null) {
    if (data.mobileNumber == mobileNumber) {
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'mobileNumber not Match');
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Email Not Registored');
  }

  return data;
};

const createHostProduct = async (body) => {
  const data = await Host.findById(body.uid);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }
  return HostProduct.create(body);
};

const createHostStreaming = async (userBody) => {
  const appID = 'ca6623e754e244a89f86eeb0bda8eb93';
  const appCertificate = '1ded1caf4a604b58834ff3c6b12b12bd';

  // const user = req.body.user;
  // const role = Agora.RtmRole.Rtm_User;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  console.log(currentTimestamp);
  const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;
  const token = Agora.RtmTokenBuilder.buildToken(appID, appCertificate, userBody.selectHost, expirationTimestamp);
  let values = { ...userBody, ...{ token: token } };
  return HostStreaming.create(values);
};

const hostAll = async () => {
  const data = await Host.find();
  return data;
};

const getAll = async () => {
  const data = await Host.find();
  return data;
};

const RecipentAll = async () => {
  const data = await Host.find({ category: 'recipient' });
  return data;
};

const getliveProduct = async () => {
  // const data = await HostStreaming.aggregate([
  //   {
  //     $lookup: {
  //       from: 'hostproducts',
  //       localField: 'selectProduct',
  //       foreignField: 'product',
  //       // pipeline: [{ $match: { uid: userid } }],
  //       as: 'hostproducts',
  //     },
  //   },
  // ]);
  const data = await HostStreaming.aggregate([
    {
      $lookup: {
        from: 'hosts',
        localField: 'selectHost',
        foreignField: '_id',
        // pipeline: [{ $match: { uid: userid } }],
        as: 'host',
      },
    },
    {
      $unwind: '$host',
    },
    {
      $project: {
        _id: 1,
        date: 1,
        time: 1,
        selectHost: 1,
        selectProduct: 1,
        stremingDate: 1,
        startTime: 1,
        endTime: 1,
        participantAllowed: 1,
        allowChat: 1,
        token: 1,
        hostId: '$host._id',
        hostName: '$host.name',
        liveStatus: 1,
      },
    },
  ]);
  return data;
};

const getAllLiveStremingDatas = async (userid) => {
  const data = await HostStreaming.aggregate([
    {
      $lookup: {
        from: 'hosts',
        localField: 'selectHost',
        pipeline: [
          {
            $match: {
              $and: [{ category: { $eq: 'host' } }],
            },
          },
        ],
        foreignField: '_id',
        as: 'hosts',
      },
    },
    { $unwind: '$hosts' },
    {
      $lookup: {
        from: 'hostproducts',
        localField: 'selectProduct',
        foreignField: 'product',
        pipeline: [{ $match: { uid: userid } }],
        as: 'hostproducts',
      },
    },
    {
      $unwind: { preserveNullAndEmptyArrays: true, path: '$hostproducts' },
    },
    {
      $project: {
        hostname: '$hosts.name',
        token: 1,
        allowChat: 1,
        participantAllowed: 1,
        endTime: 1,
        startTime: 1,
        stremingDate: 1,
        selectProduct: '$hostproducts.product',
        productId: '$hostproducts._id',
        selectHost: 1,
      },
    },
  ]);
  return data;
};
const { generateApiKey } = require('generate-api-key');

const getUserProductLive = async (id) => {
  const data = await HostProduct.aggregate([
    {
      $match: {
        $and: [{ uid: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'hoststreamings',
        localField: 'product',
        foreignField: 'selectProduct',
        pipeline: [
          {
            $lookup: {
              from: 'hosts',
              localField: 'selectHost',
              foreignField: '_id',
              as: 'hosts',
            },
          },
          {
            $unwind: {
              preserveNullAndEmptyArrays: true,
              path: '$hosts',
            },
          },
          {
            $project: {
              _id: 1,
              date: 1,
              time: 1,
              liveStatus: 1,
              selectHost: 1,
              selectProduct: 1,
              stremingDate: 1,
              startTime: 1,
              endTime: 1,
              participantAllowed: 1,
              allowChat: 1,
              token: 1,
              createdAt: 1,
              updatedAt: 1,
              hostName: '$hosts.name',
              recipient:1,
            },
          },
        ],
        as: 'hoststreamings',
      },
    },
  ]);
  return data;
};

const getAllLiveStremingDatasSame = async (id) => {
  console.log(generateApiKey());
  const data = await HostProduct.aggregate([
    {
      $match: {
        $and: [{ uid: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'hoststreamings',
        localField: 'product',
        foreignField: 'selectHost',
        as: 'hoststreamings',
      },
    },
    { $unwind: '$hoststreamings' },

    // {
    //   $match: {
    //     $and: [{ uid: { $eq: id } }],
    //   },
    // },
    // {
    //   $lookup: {
    //     from: 'hostproducts',
    //     localField: 'product',
    //     foreignField: 'product',
    //     as: 'hostproducts',
    //   },
    // },
    // { $unwind: '$hostproducts' },
    // {
    //   $lookup: {
    //     from: 'hosts',
    //     localField: 'hostproducts.uid',
    //     pipeline: [
    //       {
    //         $match: {
    //           $and: [{ category: { $eq: 'host' } }],
    //         },
    //       },
    //     ],
    //     foreignField: '_id',
    //     as: 'hosts',
    //   },
    // },
    // { $unwind: '$hosts' },
    // {
    //   $lookup: {
    //     from: 'hoststreamings',
    //     localField: 'hosts._id',
    //     foreignField: 'selectHost',
    //     as: 'hoststreamings',
    //   },
    // },
    // { $unwind: '$hoststreamings' },
    // {
    //   $project: {
    //     hostName: '$hosts.name',
    //     selectProduct: '$hoststreamings.selectProduct',
    //     stremingDate: '$hoststreamings.stremingDate',
    //     selectHost: '$hoststreamings.selectHost',
    //     _id1: '$hoststreamings._id',
    //     startTime: '$hoststreamings.startTime',
    //     endTime: '$hoststreamings.endTime',
    //     participantAllowed: '$hoststreamings.participantAllowed',
    //     allowChat: '$hoststreamings.allowChat',
    //     token: '$hoststreamings.token',
    //   },
    // },
  ]);
  return data;
};

const getAllproductById = async (id) => {
  const data = await HostProduct.aggregate([
    {
      $match: {
        $and: [{ uid: { $eq: id } }],
      },
    },
  ]);
  return data;
};

const getAllStreaming = async (id) => {
  const data = await HostStreaming.aggregate([
    {
      $match: {
        $and: [{ selectHost: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'hostproducts',
        localField: 'selectProduct',
        foreignField: 'product',
        pipeline: [{ $match: { uid: id } }],
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $project: {
        _id: 1,
        date: 1,
        time: 1,
        selectHost: 1,
        selectProduct: 1,
        stremingDate: 1,
        startTime: 1,
        endTime: 1,
        allowChat: 1,
        participantAllowed: 1,
        token: 1,
        createdAt: 1,
        updatedAt: 1,
        liveStatus: 1,
        productName: '$product.product',
      },
    },
  ]);
  return data;
};

const getAllStreamingToken = async (id) => {
  const data = await HostStreaming.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'hosts',
        localField: 'selectHost',
        foreignField: '_id',
        as: 'host',
      },
    },
    {
      $unwind: '$host',
    },
    {
      $project: {
        _id: 1,
        date: 1,
        time: 1,
        liveStatus: 1,
        selectHost: 1,
        selectProduct: 1,
        stremingDate: 1,
        endTime: 1,
        startTime: 1,
        participantAllowed: 1,
        allowChat: 1,
        token: 1,
        createdAt: 1,
        updatedAt: 1,
        hostName: '$host.name',
        image: '$host.image',
        stock: 1,
        priceperKg: 1,
        recipient:1,
      },
    },
  ]);
  return data;
};

const liveUpdations = async (id, body) => {
  let values = await HostStreaming.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Live not Available');
  }
  values = await HostStreaming.findByIdAndUpdate({ _id: id }, body, { new: true });
  return values;
};

const getproductById = async (id) => {
  let values = await HostProduct.findById(id);
  return values;
};

const getcloud = async (id) => {
  let values = await HostProduct.findById(id);
  return values;
};


const recipientAdd = async (id, body) => {
  const { recipient } = body;
  let liveStreams = await HostStreaming.findById(id);
  if (!liveStreams) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
 await HostStreaming.update({ _id: id }, { $push: { recipient: recipient } }, { new: true });
  let afterupdate = await HostStreaming.findById(id);
  return afterupdate;
};

const recipientRemove = async (id, body) => {
  const { recipient } = body;
  let liveStreams = await HostStreaming.findById(id);
  if (!liveStreams) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }
  await HostStreaming.update({ _id: id }, { $pull: { recipient: recipient } }, { new: true });
 let afterupdate = await HostStreaming.findById(id);
  return afterupdate;
};

const getsubStreamingData = async (userid) => {
let data = await Host.aggregate([
  {
    $match: {
      $and: [{ _id: { $eq: userid } }],
    },
  },
  {
    $lookup: {
      from: 'hoststreamings',
      localField: 'hostId',
      foreignField: 'selectHost',
      pipeline:[
        {
          $match: {
            $and: [{ liveStatus: { $ne: "LiveFinished" } }],
          },
        },
      ],
      as: 'hoststreamings',
    },
  },
  {
    $unwind: '$hoststreamings',
  },
  {
    $project:{
      name:1,
      streamid:"$hoststreamings._id",
      date:"$hoststreamings.date",
      time:"$hoststreamings.time",
      recipient:"$hoststreamings.recipient",
      liveStatus:"$hoststreamings.liveStatus",
      selectHost:"$hoststreamings.selectHost",
      selectProduct:"$hoststreamings.selectProduct",
      stremingDate:"$hoststreamings.stremingDate",
      startTime:"$hoststreamings.startTime",
      endTime:"$hoststreamings.endTime",
      participantAllowed:"$hoststreamings.participantAllowed",
      allowChat:"$hoststreamings.allowChat",
      stock:"$hoststreamings.stock",
      priceperKg:"$hoststreamings.priceperKg",
      token:"$hoststreamings.token",
    }
  }
 
])
  return data;
};

module.exports = {
  createHost,
  loginhostEmailAndPassword,
  createHostProduct,
  createHostStreaming,
  hostAll,
  getAllLiveStremingDatas,
  getAllLiveStremingDatasSame,
  getAllproductById,
  RecipentAll,
  getAllStreaming,
  getAllStreamingToken,
  getAll,
  getliveProduct,
  liveUpdations,
  getUserProductLive,
  getproductById,
  recipientAdd,
  recipientRemove,
  getsubStreamingData,
};
