const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const Agora = require('agora-access-token');
const moment = require('moment');
const { Groupchat } = require('../../models/liveStreaming/chat.model');
const Supplier = require('../../models/supplier.model');

const { tempTokenModel, Joinusers } = require('../../models/liveStreaming/generateToken.model');
const {
  DemoPost,
  DemoUser,
  Demobuyer,
  DemostreamToken,
  DemoInstested,
  Demootpverify,
  Democloudrecord,
  MutibleDemo
} = require('../../models/demo.realestate.model');

const chat_room_create = async (req, io) => {
  // //console.log(req)
  let dateIso = new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime();
  let stream = await Joinusers.findById(req.id)
  let user = await Shop.findById(stream.shopId)
  let data = await Groupchat.create({ ...req, ...{ created: moment(), dateISO: dateIso, userName: user.SName, userType: "buyer", shopId: stream.shopId, joinuser: req.id } })
  console.log(data, 7868777889, req)
  io.sockets.emit(req.channel, data);
}

const getoldchats = async (req) => {
  //console.log(req)
  let data = await Groupchat.find({ channel: req.query.channel, removeMessage: { $ne: true } }).sort({ dateISO: 1 });
  return data;
}


const chat_room_create_subhost = async (req, io) => {
  // //console.log(req)
  let dateIso = new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime();
  let token = await tempTokenModel.findById(req.id)
  let user = await Seller.findById(token.supplierId)
  let data = await Groupchat.create({ ...req, ...{ created: moment(), dateISO: dateIso, userName: user.contactName, userType: "supplier", supplierId: user._id, joinuser: req.id, user } })
  // //console.log(req)
  io.sockets.emit(req.channel, data);
}
const chat_room_create_host = async (req, io) => {
  // //console.log(req)
  let dateIso = new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime();
  let token = await Streamrequest.findById(req.id)
  let user = await Seller.findById(token.suppierId);
  // console.log(token)
  // console.log(user)
  let data = await Groupchat.create({ ...req, ...{ created: moment(), dateISO: dateIso, userName: user.tradeName, userType: "supplier", supplierId: user._id, joinuser: req.id, user } })
  // //console.log(req)
  io.sockets.emit(req.channel, data);
}

const chat_room_create_host_demo = async (req, io) => {
  let dateIso = new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime();
  let token = await DemoPost.findById(req.id)
  let his = await MutibleDemo.findById(token.runningStream);
  let user = await DemoUser.findById(token.userId)
  console.log(req)
  let data = await Groupchat.create({ ...req, ...{ created: moment(), dateISO: dateIso, userName: user.userName, userType: "supplier", supplierId: user._id, joinuser: user._id, user } })
  io.sockets.emit(req.channel, data);
}

const chat_room_create_host_demo_sub = async (req, io) => {
  console.log(req)

  let temp = await DemostreamToken.findById(req.userId);
  let user = await Demobuyer.findById(temp.userID);
  let dateIso = new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime();
  // let user = await Demoseller.findById(token.userID)
  let data = await Groupchat.create({ ...req, ...{ created: moment(), dateISO: dateIso, userName: user.userName, userType: "buyer", supplierId: user._id, joinuser: temp._id, user } })
  io.sockets.emit(req.channel, data);
}

const livejoined_now = async (req, io, type) => {
  console.log(req)

  let temp = await DemostreamToken.findById(req.user);
  if (temp) {
    let stream = await Demostream.findById(temp.streamID);
    if (stream) {
      if (stream.status != 'Completed') {
        let joined = stream.userList != null ? stream.userList : [];
        if (type == "join") {
          let index = joined.indexOf(req.user);
          if (index == -1) {
            joined.push(req.user)
          }
        }
        else {
          let index = joined.indexOf(req.user);
          if (index != -1) {
            joined.splice(index, 1)
          }
        }
        stream.userList = joined;
        stream.current_watching_stream = joined.length
        stream.save();
        io.sockets.emit(stream._id + "_stream_joins", stream);
      }
    }
  }
}

const change_controls = async (req, io) => {
  // //console.log(req)
  let token = await Streamrequest.findById(req.channel);
  token.audio = req.audio
  token.video = req.video
  token.save();
  io.sockets.emit('toggle_controls' + req.channel, token);

}
module.exports = {
  chat_room_create,
  getoldchats,
  chat_room_create_subhost,
  chat_room_create_host,
  change_controls,
  chat_room_create_host_demo,
  chat_room_create_host_demo_sub,
  livejoined_now
};
