const express = require('express');
const router = express.Router();
const DemoUserController = require('../../controllers/demo.realestate.controller');
const multer = require('multer');
const storage = multer.memoryStorage({
  destination: function (req, res, callback) {
    callback(null, '');
  },
});
const upload = multer({ storage }).single('image');
const arrayImage = multer({ storage }).array('imageArr');

router.route('/user').post(DemoUserController.createDemoUser);
router.route('/post').post(DemoUserController.createDemoPost);
router.route('/post/:id').put(DemoUserController.updatePostById);
router.route('/image/:id').put(upload, DemoUserController.imageUploadForPost);
router.route('/image/group/:id').put(arrayImage, DemoUserController.image_upload_multiple);
router.route('/getUsers').get(DemoUserController.getUsers);


router.route('/get/my/post').get(DemoUserController.get_my_post);


module.exports = router;
