const express = require('express');
const router = express.Router();
const conversationModel = require('../../models/conversation.model');
const MessageModel = require('../../models/message.model');
const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require('socket.io');
// const io = new Server(server);

// <........... conversation flow ...........>

// create Conversation
router.post('/conversation', async (req, res) => {
  const newConversation = new conversationModel({
    members: [req.body.chatId],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch {
    res.status(500).json(err);
  }
});

// get Conversation

router.get('/conversation/:id', async (req, res) => {
  try {
    const conversation = await conversationModel.find({
      members: { $in: [req.params.id] },
    });
    res.status(200).json(conversation);
  } catch {
    res.status(500).json(err);
  }
});

// < .................. message flow ........... >

// create Message

router.post('/message', async (req, res) => {
  try {
    const message = await MessageModel.create({
      conversationId: req.body.conversationId,
      text: req.body.text,
      senderId: req.body.senderId,
    });
    res.status(200).json(message);
  } catch {
    res.status(500).json(err);
  }
});

router.get('/message/:conversationId', async (req, res) => {
  try {
    const conversation = await MessageModel.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(conversation);
  } catch {
    res.status(500).json(err);
  }
});

module.exports = router;
