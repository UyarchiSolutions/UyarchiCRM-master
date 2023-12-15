const express = require('express');

const router = express.Router();
const demostream = require('../../../controllers/liveStreaming/DemoStream.controller');

router.route('/getDatas').get(demostream.getDatas);

router.route('/get/stream/details').get(demostream.get_stream_details);
router.route('/send/otp').get(demostream.send_otp);
router.route('/verify/otp').post(demostream.verify_otp);
router.route('/select/data/time').post(demostream.select_data_time);
router.route('/one/more/time').post(demostream.add_one_more_time);

router.route('/end/stream').get(demostream.end_stream);

router.route('/seller/go/live').post(demostream.seller_go_live);
router.route('/seller/live/details').get(demostream.seller_go_live_details);

router.route('/video/start/cloud').get(demostream.start_cloud);

// Buyer Side Stream

router.route('/buyer/join/stream').post(demostream.buyer_join_stream);
router.route('/buyer/get/property').post(demostream.get_buyer_join_stream);
router.route('/buyer/go/live').get(demostream.buyer_go_live_stream);

router.route('/buyer/stream/details').get(demostream.byer_get_stream_details);
router.route('/buyer/interest/now').post(demostream.buyer_interested);
router.route('/getStreamDetails/:id').get(demostream.getStreamDetails);

// router.route('').get(demostream.send_sms_now);

module.exports = router;
