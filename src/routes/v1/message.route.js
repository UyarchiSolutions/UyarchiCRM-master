const express = require('express');
const router = express.Router();
const { Messages } = require('../../models/message.model');
const moment = require('moment');
const meesageController = require('../../controllers/message.controller');

router.route('/getMessage/:id').get(meesageController.getchtting_message);

module.exports = router;
