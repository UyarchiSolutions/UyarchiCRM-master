const express = require('express');
const authorization = require('../../controllers/token.verify.controller');

const router = express.Router();
const AgoraAppId = require('../../controllers/AgoraAppId.controller');

router.route('/insert/app/id').post(authorization, AgoraAppId.InsertAppId);
router.get('/get/app/id', AgoraAppId.InsertAget_app_id);
router.get('/get/token', AgoraAppId.get_all_token);
router.route('/get/token/my').get(authorization, AgoraAppId.get_all_token_my);
router.get('/get/token/check', AgoraAppId.get_all_token_check);
router.get('/get/country', AgoraAppId.get_country_list);
router.get('/get/state', AgoraAppId.get_state_list);
router.get('/get/city', AgoraAppId.get_city_list);
router.get('/get/token/usage/agri', AgoraAppId.get_token_usage_agri);
router.get('/get/token/usage/demo', AgoraAppId.get_token_usage_demo);

router.route('/test/appid',).get(authorization, AgoraAppId.test_appid);
router.route('/test/appid/details',).get(AgoraAppId.get_test_details_test);

router.route('/test/appid/start',).get(AgoraAppId.recording_start);
router.route('/test/appid/stop',).get(AgoraAppId.recording_stop);




router.route('/check/appid').put(authorization, AgoraAppId.update_check_appid_working);
router.route('/check/appid/reject').put(authorization, AgoraAppId.update_check_appid_faild);


module.exports = router;
