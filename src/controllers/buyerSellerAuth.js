const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tokenTypes } = require('../config/tokens');
const jwt = require('jsonwebtoken');
const tokenService = require('../services/token.service');
const config = require('../config/config');
const { BuyerSeller } = require('../models/BuyerSeller.model');

const authorization = async (req, res, next) => {
  const token = req.headers.auth;
  //   console.log(token);
  // console.log(req.headers.auth);
  // console.log(req.headers['auth']);
  if (!token) {
    return res.send(httpStatus.UNAUTHORIZED, 'user must be LoggedIn....');
  }
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    const userss = await BuyerSeller.findOne({ _id: payload.sub });
    if (!userss) {
      return res.send(httpStatus.UNAUTHORIZED, 'User Not Available');
    }
    req.userId = payload.sub;
    return next();
  } catch {
    return res.send(httpStatus.UNAUTHORIZED, 'Invalid Access Token');
  }
};

module.exports = authorization;
