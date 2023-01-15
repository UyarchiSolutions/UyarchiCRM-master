const multer = require('multer');
const path = require('path');

let counts = 0;
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.join(__dirname, '../../public/resumes/host'));
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    counts++;
    cb(null, Date.now() + counts.toString() + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/webp'
    ) {
      callback(null, true);
    } else {
      console.log('Only png And Jpg file supported!');
      callback(null, false);
    }
  },
  limits: {
    fileSize: 3024 * 3024 * 3,
  },
});

module.exports = upload;
