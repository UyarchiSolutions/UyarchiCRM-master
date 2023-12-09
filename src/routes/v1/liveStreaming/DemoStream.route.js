const express = require('express');


const router = express.Router();
const demostream = require('../../../controllers/liveStreaming/DemoStream.controller');


router.route('/getDatas').get(demostream.getDatas);

router.route('/get/stream/details').get(demostream.get_stream_details);
router.route('/send/otp').get(demostream.send_otp);
router.route('/verify/otp').post(demostream.verify_otp);
router.route('/select/data/time').post(demostream.select_data_time);
router.route('/one/more/time').post(demostream.add_one_more_time);





router.route('/seller/go/live').post(demostream.seller_go_live);
router.route('/seller/live/details').get(demostream.seller_go_live_details);



router.route('/start/cloud').post(demostream.start_cloud);



// router.route('').get(demostream.send_sms_now);

module.exports = router;
