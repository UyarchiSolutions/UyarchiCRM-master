const express = require('express');


const router = express.Router();
const demostream = require('../../controllers/liveStreaming/DemoStream.controller');


router.route('/getDatas').get(demostream.getDatas);

router.route('/get/stream/details').get(demostream.get_stream_details);
router.route('/send/otp').get(demostream.send_otp);


// router.route('').get(demostream.send_sms_now);

module.exports = router;
