const express = require('express');
const b2bUsersController = require('../../controllers/B2BUser.Controller');
const router = express.Router();
const authorization = require('../../controllers/tokenVerify.controller');

router.post('/', b2bUsersController.createB2bUsers);
router.post('/login', b2bUsersController.B2bUsersLogin);
router.get('/All/:page', b2bUsersController.getAllUsers);

module.exports = router;
