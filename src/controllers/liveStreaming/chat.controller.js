const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const chatservice = require('../../services/liveStreaming/chat.service');


const getoldchats= catchAsync(async (req, res) => {
    const data = await chatservice.getoldchats(req);
    res.status(httpStatus.CREATED).send(data);
  });


module.exports = {
    getoldchats
  };
  