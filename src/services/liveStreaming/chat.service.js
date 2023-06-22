const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const Agora = require('agora-access-token');
const moment = require('moment');
const { Groupchat } = require('../../models/liveStreaming/chat.model');

const { tempTokenModel, Joinusers } = require('../../models/liveStreaming/generateToken.model');


const chat_room_create = async (req, io) => {
  // //console.log(req)
  let dateIso = new Date(new Date(moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss'))).getTime();
  let stream = await Joinusers.findById(req.id)
  let user = await Shop.findById(stream.shopId)
  let data = await Groupchat.create({ ...req, ...{ created: moment(), dateISO: dateIso, userName: user.SName, userType: "buyer", shopId: stream.shopId, joinuser: req.id } })
  // //console.log(data)
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
  let user = await Seller.findById(token.suppierId)
  let data = await Groupchat.create({ ...req, ...{ created: moment(), dateISO: dateIso, userName: user.contactName, userType: "supplier", supplierId: user._id, joinuser: req.id, user } })
  // //console.log(req)
  io.sockets.emit(req.channel, data);
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
  change_controls
};
