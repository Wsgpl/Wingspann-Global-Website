const express = require('express');
const multer = require('multer');
const router = express.Router();
const auth = require('../../middleware/auth');
const mediaUpload = require('../../middleware/mediaUpload');

function getRequestBaseUrl(req) {
  const configuredBase = process.env.PUBLIC_API_URL || process.env.API_URL || '';
  if (configuredBase) return configuredBase.replace(/\/$/, '');
  return `${req.protocol}://${req.get('host')}`;
}

// POST /api/admin/upload
// Protected: only admin can upload media.
router.post('/', auth, (req, res) => {
  mediaUpload.single('file')(req, res, (err) => {
    if (err) {
      const isSizeError = err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE';
      return res.status(400).json({
        error: isSizeError ? 'File is too large. Maximum upload size is 100MB.' : err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Save relative URLs in DB; use public_url for immediate previews/debugging.
    const url = `/uploads/media/${req.file.filename}`;

    return res.json({
      success: true,
      url,
      public_url: `${getRequestBaseUrl(req)}${url}`,
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  });
});

module.exports = router;
