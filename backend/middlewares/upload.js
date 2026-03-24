const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadSingleImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }
    return next();
  });
};

module.exports = { uploadSingleImage };
