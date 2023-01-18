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
// const io = require('socket.io')(httpServer, {
//   cors: {
//     origin: '*',
//   },
// });
// io.on('connection', (socket) => {
// const { roomId } = socket.handshake.query;
// socket.join(roomId);
// socket.on('message', async ({ userId, message }) => {
//   io.in(roomId).emit('message', { userId, message });
//   await Messages.create({ userId: userId, message: message, roomId: roomId, created: moment() });
//   console.log(userId, message, roomId);
//   socket.emit('me', socket.id);
//   console.log(socket.id);
//   socket.on('callUser', ({ userToCall, signalData, from, name }) => {
//     io.to(userToCall).emit('callUser', {
//       signal: signalData,
//       from,
//       name,
//     });
//   });
//   socket.on('updateMyMedia', ({ type, currentMediaStatus }) => {
//     console.log('updateMyMedia');
//     socket.broadcast.emit('updateUserMedia', { type, currentMediaStatus });
//   });
//   socket.on('msgUser', async ({ name, to, msg, sender }) => {
//     io.to(to).emit('msgRcv', { name, msg, sender });
//     await Messages.create({ userId: name, message: msg, roomId: socket.id, created: moment() });
//   });
//   socket.on('answerCall', (data) => {
//     socket.broadcast.emit('updateUserMedia', {
//       type: data.type,
//       currentMediaStatus: data.myMediaStatus,
//     });
//     io.to(data.to).emit('callAccepted', data);
//   });
//   socket.on('endCall', ({ id }) => {
//     io.to(id).emit('endCall');
//   });
// });
// });
// Socket Message Api's
// app.use(fileUpload());
app.use(express.static('public'));
// const server = http.createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});
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
//default routes
app.get('/', (req, res) => {
  res.sendStatus(200);
});
// default v1 route
app.get('/v1', (req, res) => {
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
