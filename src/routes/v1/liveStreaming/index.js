const express = require('express');
const generateAuthTokens = require('./generateToken.route');
const chatModel = require('./chat.route');
const demoRoute = require('./DemoStream.route');
const docsRoute = require('../docs.route');
const config = require('../../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/generateRTC',
    route: generateAuthTokens,
  },
  {
    path: '/chat',
    route: chatModel,
  },
  {
    path: '/demostream',
    route: demoRoute,
  },
];

const devRoutes = [
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
