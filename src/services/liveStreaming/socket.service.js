const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const Agora = require('agora-access-token');
const moment = require('moment');
const { Groupchat } = require('../../models/liveStreaming/chat.model');
const { Shop } = require('../../models/b2b.ShopClone.model');
const { Streamplan, StreamPost, Streamrequest, StreamrequestPost } = require('../../models/ecomplan.model');
const Supplier = require('../../models/supplier.model');

const { tempTokenModel, Joinusers } = require('../../models/liveStreaming/generateToken.model');
const { CodeBuild } = require('aws-sdk');

const romove_message = async (req, io) => {
  //console.log(req)
  let message = await Groupchat.findById(req._id);
  message.removeMessage = true;
  message.save();
  io.sockets.emit(req.channel + "remove_image", message);
}

const ban_user_chat = async (req, io) => {
  let joinuser = await Joinusers.findById(req.joinuser);
  joinuser.joindedUserBan = true;
  joinuser.save();
  //console.log(joinuser)
  io.sockets.emit(req.joinuser + "ban_chat", joinuser);

}
const leave_subhost = async (req, io) => {
  let token = await tempTokenModel.findByIdAndUpdate({ _id: req.tokenId }, { mainhostLeave: true }, { new: true });
  io.sockets.emit(req.streamId + req.uid, { req, token });
}
const stream_view_change = async (req, io) => {
  let stream = await tempTokenModel.updateMany({ chennel: req.chennel }, { bigSize: false }, { new: true });
  let token = await tempTokenModel.findByIdAndUpdate({ _id: req.tokenId }, { bigSize: req.bigSize }, { new: true });
  io.sockets.emit(req.streamId + "stream_view_change", { req, token, stream });
}

const host_controll_audio = async (req, io) => {
  let token = await tempTokenModel.findById(req.tokenId);
  let res = await tempTokenModel.findOne({ Uid: req.userId, chennel: token.chennel })
  let result = await tempTokenModel.findByIdAndUpdate({ _id: res._id }, req, { new: true })
  result.controlledBy = 'mainhost'
  result.save();
  // , req, { new: true }
  // let res = await tempTokenModel.findByIdAndUpdate({ _id: token }, req, { new: true })
  io.sockets.emit(result._id + result.Uid + "_audio", { req, result });
}
const host_controll_video = async (req, io) => {
  let token = await tempTokenModel.findById(req.tokenId);
  let res = await tempTokenModel.findOne({ Uid: req.userId, chennel: token.chennel })
  let result = await tempTokenModel.findByIdAndUpdate({ _id: res._id }, req, { new: true })
  result.controlledBy = 'mainhost'
  result.save();
  // , req, { new: true }
  // let res = await tempTokenModel.findByIdAndUpdate({ _id: token }, req, { new: true })
  io.sockets.emit(result._id + result.Uid + "_video", { req, result });
}
const host_controll_all = async (req, io) => {
  let token = await tempTokenModel.findById(req.tokenId);
  let res = await tempTokenModel.findOne({ Uid: req.userId, chennel: token.chennel })
  let result = await tempTokenModel.findByIdAndUpdate({ _id: res._id }, { ...req, ...{ video: true, audio: true } }, { new: true })
  result.controlledBy = 'mainhost'
  result.save();
  // , req, { new: true }
  // let res = await tempTokenModel.findByIdAndUpdate({ _id: token }, req, { new: true })
  io.sockets.emit(result._id + result.Uid + "_all", { req, result });
}

const admin_allow_controls = async (req, io) => {
  let token = await tempTokenModel.findById(req.tokenId);
  let res = await tempTokenModel.findOne({ Uid: req.userId, chennel: token.chennel })
  let result = await tempTokenModel.findByIdAndUpdate({ _id: res._id }, { ...req, ...{ mainhostLeave: false } }, { new: true })
  result.controlledBy = 'mainhost'
  result.save();
  io.sockets.emit(result._id + result.Uid + "allow_stream", { req, result });
}
const startStop_post = async (req, io) => {
  // let dateIso = new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime();
  // let stream = await Joinusers.findById(req.id)
  // let user = await Shop.findById(stream.shopId)
  // let data = await Groupchat.create({ ...req, ...{ created: moment(), dateISO: dateIso, userName: user.SName, userType: "buyer", shopId: stream.shopId, joinuser: req.id } })

  let post = await StreamPost.findById(req.streampostsId);
  if (req.start) {
    let streamStart = new Date().getTime();
    await StreamPost.findByIdAndUpdate({ _id: req.streampostsId }, { streamStart: streamStart }, { new: true });
  }
  if (req.end) {
    let streamEnd = new Date().getTime();
    await StreamPost.findByIdAndUpdate({ _id: req.streampostsId }, { streamEnd: streamEnd }, { new: true });

  }

  // post.save();

  let value = await Streamrequest.aggregate([
    { $match: { $and: [{ adminApprove: { $eq: "Approved" } }, { _id: { $eq: req.streamId } }] } },
    {
      $lookup: {
        from: 'streamrequestposts',
        localField: '_id',
        foreignField: 'streamRequest',
        pipeline: [
          {
            $lookup: {
              from: 'streamposts',
              localField: 'postId',
              foreignField: '_id',
              pipeline: [
                {
                  $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'products',
                  },
                },
                { $unwind: "$products" },
                {
                  $project: {
                    _id: 1,
                    productTitle: "$products.productTitle",
                    productImage: "$products.image",
                    productId: 1,
                    categoryId: 1,
                    quantity: 1,
                    marketPlace: 1,
                    offerPrice: 1,
                    postLiveStreamingPirce: 1,
                    validity: 1,
                    minLots: 1,
                    incrementalLots: 1,
                    suppierId: 1,
                    DateIso: 1,
                    created: 1,
                    streamStart: 1,
                    streamEnd: 1
                  }
                }
              ],
              as: 'streamposts',
            },
          },
          { $unwind: "$streamposts" },
          {
            $project: {
              _id: 1,
              productTitle: "$streamposts.productTitle",
              productId: "$streamposts.productId",
              quantity: "$streamposts.quantity",
              marketPlace: "$streamposts.marketPlace",
              offerPrice: "$streamposts.offerPrice",
              postLiveStreamingPirce: "$streamposts.postLiveStreamingPirce",
              validity: "$streamposts.validity",
              minLots: "$streamposts.minLots",
              incrementalLots: "$streamposts.incrementalLots",
              productImage: "$streamposts.productImage",
              streamStart: "$streamposts.streamStart",
              streamEnd: "$streamposts.streamEnd",
              streampostsId: "$streamposts._id"

            }
          }
        ],
        as: 'streamrequestposts',
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'suppierId',
        foreignField: '_id',
        as: 'suppliers',
      },
    },
    { $unwind: "$suppliers" },
    {
      $lookup: {
        from: 'streamrequestposts',
        localField: '_id',
        foreignField: 'streamRequest',
        pipeline: [
          { $match: { $and: [{ streamStart: { $ne: null } }, { streamEnd: { $eq: null } }] } },
          { $group: { _id: null, count: { $sum: 1 } } }
        ],
        as: 'streamrequestposts_start',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$streamrequestposts_start',
      },
    },
    {
      $addFields: {
        streamPending: { $ifNull: ['$streamrequestposts_start.count', false] },
      },
    },
    {
      $project: {
        _id: 1,
        supplierName: "$suppliers.primaryContactName",
        active: 1,
        archive: 1,
        post: 1,
        communicationMode: 1,
        sepTwo: 1,
        bookingAmount: 1,
        streamingDate: 1,
        streamingTime: 1,
        discription: 1,
        streamName: 1,
        suppierId: 1,
        postCount: 1,
        DateIso: 1,
        created: 1,
        planId: 1,
        streamrequestposts: "$streamrequestposts",
        adminApprove: 1,
        Duration: 1,
        startTime: 1,
        endTime: 1,
        streamPending: 1

      }
    },

  ])
  io.sockets.emit(req.streamId + "postStart", { post, value });

}

module.exports = {
  startStop_post,
  leave_subhost,
  host_controll_audio,
  host_controll_video,
  host_controll_all,
  admin_allow_controls,
  stream_view_change,
  romove_message,
  ban_user_chat
};
