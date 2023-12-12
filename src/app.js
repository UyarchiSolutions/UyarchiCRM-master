const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
// const config = require('./config/config');
const logger = require('./config/logger');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const app = express();
const mongoose = require('mongoose');
const http = require('http');
const MessageRoute = require('./routes/v1/message.route');
const httpServer = http.createServer(app);
const { Messages } = require('../src/models/message.model');
const moment = require('moment');
const Auth = require('./controllers/BuyerAuth');
const AWS = require('aws-sdk');
var bodyParser = require('body-parser');
const { SellerPost, Buyer } = require('./models/BuyerSeller.model');
const multer = require('multer');
const userPlane = require('./models/usersPlane.model');
const socketService = require('./services/liveStreaming/socket.service');
const chetModule = require('./services/liveStreaming/chat.service');


const routes_v2 = require('./routes/v1/liveStreaming');

let socketIO = require('socket.io');
let io = socketIO(httpServer);


io.sockets.on('connection', async (socket) => {

  console.log("connection established")

  socket.on('groupchat', async (data) => {
    await chetModule.chat_room_create(data, io);
  });

  socket.on('groupchatsubhost', async (data) => {
    //console.log("hello", data)
    await chetModule.chat_room_create_subhost(data, io);
  });
  socket.on('groupchathost', async (data) => {
    await chetModule.chat_room_create_host(data, io);
  });

  socket.on('toggle_controls', async (data) => {
    await chetModule.change_controls(data, io);
  });

  socket.on('post_start_end', async (data) => {
    await socketService.startStop_post(data, io);
  });
  socket.on('leave_subhost', async (data) => {
    await socketService.leave_subhost(data, io);
  });
  socket.on('allow_subhost', async (data) => {
    await socketService.admin_allow_controls(data, io);
  });

  socket.on('disconnect', async () => {
  });

  socket.on('', (msg) => {
  });
  socket.on('host_controll_audio', async (data) => {
    await socketService.host_controll_audio(data, io);
  });

  socket.on('host_controll_video', async (data) => {
    await socketService.host_controll_video(data, io);
  });
  socket.on('host_controll_all', async (data) => {
    await socketService.host_controll_all(data, io);
  });
  socket.on('stream_view_change', async (data) => {
    await socketService.stream_view_change(data, io);
  });
  socket.on('romove_message', async (data) => {
    await socketService.romove_message(data, io);
  });
  socket.on('ban_user_chat', async (data) => {
    await socketService.ban_user_chat(data, io);
  });
  socket.on('groupchathost_demo', async (data) => {
    await chetModule.chat_room_create_host_demo(data, io);
  });
  socket.on('groupchathost_demo_buyer', async (data) => {
    await chetModule.chat_room_create_host_demo_sub(data, io);
  });
  socket.on('liveleave', async (data) => {
    await chetModule.livejoined_now(data, io, 'leave');
  });
  socket.on('livejoined', async (data) => {
    await chetModule.livejoined_now(data, io, 'join');
  });
  socket.on('privateChat', async (data) => {
    await privatechat.recived_message(data, io, socket.handshake.auth);
  });

  socket.on('privateChatexp', async (data) => {
    await privatechat.recived_message_exp(data, io, socket.handshake.auth)
  });

  socket.on('same_user_jion_exhibitor', async (data) => {
    await privatechat.same_user_jion_exhibitor(data, io, socket.handshake.auth);
  });
  socket.on('joinRoom', (room) => {
    //console.log(room)
    socket.join(room);
    // Emit an event to notify other clients in the room about the new user joining
    //console.log(socket.id,2136712)
    socket.to(room).emit('userJoined', socket.id);
    //console.log(socket.rooms)
  });

  socket.on('disconnecting', () => {
    //console.log(socket.rooms)
    // Get the rooms the user is currently in
    const rooms = Object.keys(socket.rooms);
    //console.log(rooms)
    rooms.forEach((room) => {
      //console.log(room)
      // Emit an event to notify other clients in the room about the user disconnecting
      socket.to(room).emit('userDisconnected', socket.id);
    });
  });
  socket.on('disconnect', () => {
   
  });
});



app.use(express.static('public'));
// const server = http.createServer(app);

const { addUser, removeUser } = require('./user');
const { S3 } = require('aws-sdk');
// const PORT = 5000;
io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callBack) => {
    const { user, error } = addUser({ id: socket.id, name, room });
    if (error) return callBack(error);
    socket.join(user.room);
    socket.emit('message', {
      user: 'Admin',
      text: `Welocome to ${user.room}`,
    });
    socket.broadcast.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has joined!` });
    callBack(null);
    socket.on('sendMessage', ({ message }) => {
      io.to(user.room).emit('message', {
        user: user.name,
        text: message,
      });
    });
  });
  // socket.on('disconnect', () => {
  //   const user = removeUser(socket.id);
  //   console.log(user);
  //   io.to(user.room).emit('message', {
  //     user: 'Admin',
  //     text: `${user.name} just left the room`,
  //   });
  //   console.log('A disconnection has been made');
  // });
});

app.use(function (req, res, next) {
  req.io = io;
  next();
});
// server.listen(PORT, () => console.log(`Server is Quannected to Port ${PORT}`));

// io.on('connection', (socket) => {
//   const { roomId } = socket.handshake.query;
//   socket.join(roomId);
//   socket.on('message', async ({ userId, message }) => {
//     io.in(roomId).emit('message', { userId, message });
//     await Messages.create({ userId: userId, message: message, roomId: roomId, created: moment() });
//     console.log(userId, message, roomId);
//   });
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// });
app.use('/meesageRoute', MessageRoute);
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}
// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// sanitize request data
app.use(xss());
app.use(mongoSanitize());
// gzip compression
app.use(compression());
// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}
// v1 api routes
app.use('/v1', routes);
app.use('/v2', routes_v2);

//default routes
app.get('/', (req, res) => {
  res.sendStatus(200);
});
// default v1 route
app.get('/v1', (req, res) => {
  res.sendStatus(200);
});
app.get('/v2', (req, res) => {
  res.sendStatus(200);
});
// health status code
app.get('/health', (req, res) => {
  res.sendStatus(200);
});
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);
// mongoose connection
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
});

// server connection
httpServer.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});




// git vignesh branch
module.exports = app;
