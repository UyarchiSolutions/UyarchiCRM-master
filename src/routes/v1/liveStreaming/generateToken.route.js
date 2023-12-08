const express = require('express');
const router = express.Router();
const generateToken = require('../../../controllers/liveStreaming/generateToken.controller');
const Authorization = require('../../../controllers/BuyerAuth');
// router.route('/getToken').post( generateToken.generateToken);
// router.get('/getHostTokens', generateToken.getHostTokens);
// router.get('/gettoken/byId', generateToken.gettokenById);
// router.get('/gettoken/host/byId', generateToken.gettokenById_host);
// router.get('/getparticipents/limit', generateToken.participents_limit);
// router.put('/leave/participents/limit', generateToken.leave_participents);
// router.get('/leave/host', generateToken.leave_host);
// router.get('/join/host/admin', generateToken.join_host);
// router.post('/recording/acquire', generateToken.agora_acquire);
// router.post('/recording/start', generateToken.recording_start);
// router.post('/recording/query', generateToken.recording_query);
// router.post('/recording/stop', generateToken.recording_stop);
// router.post('/recording/updateLayout', generateToken.recording_updateLayout);
// router.post('/chat/room/details', generateToken.chat_rooms);
// router.route('/getsub/token/user').get( generateToken.get_sub_token);
// router.route('/getsub/token/golive').get( generateToken.get_sub_golive);
// router.route('/getsub/token/single').get( generateToken.get_sub_token_single);
// router.route('/participents/limit/all').get(generateToken.get_participents_limit);
// router.route('/get/current/live/stream').get( generateToken.get_current_live_stream);


// router.route('/remove/hostlive/now').get(generateToken.remove_host_live);

router.route('/create/subhost/token').post(Authorization, generateToken.create_subhost_token);
// router.route('/create/raice/your/token').post(generateToken.create_raice_token);


router.route('/livestream/generateToken/seller').post(Authorization,generateToken.production_supplier_token);
// router.route('/production/livestream/generateToken/supplier/cloudrecording').post(generateToken.production_supplier_token_cloudrecording);
// router.route('/production/livestream/generateToken/watchamin').post(generateToken.production_supplier_token_watchamin);
// router.route('/get/live/stream/videos').get(generateToken.get_stream_complete_videos);
// router.route('/download/video/aws').get(generateToken.videoConverter);


// router.route('/cloud/recording/start').get(generateToken.cloud_recording_start);


router.route('/get/stream/details').get(Authorization,generateToken.get_stream_details);



module.exports = router;
