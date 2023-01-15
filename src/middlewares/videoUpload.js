const multer = require('multer');
const path = require('path');
const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '');
  },
});
const upload = multer({ storage });
module.exports = upload;
