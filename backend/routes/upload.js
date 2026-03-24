const express = require('express');
const { Readable } = require('stream');
const { uploadSingleImage } = require('../middlewares/upload');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// POST /api/upload
router.post('/', uploadSingleImage, async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'assistio' },
        (error, uploaded) => {
          if (error) return reject(error);
          return resolve(uploaded);
        }
      );
      Readable.from(req.file.buffer).pipe(stream);
    });

    return res.json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Upload error' });
  }
});

module.exports = router;
