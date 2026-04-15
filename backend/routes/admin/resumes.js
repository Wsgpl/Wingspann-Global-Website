const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const auth = require('../../middleware/auth');

const privateResumeDir = path.join(__dirname, '../../private/resumes');

// ── GET /api/admin/resumes/:filename ─────────────────────────────────────────
// Protected route — only authenticated admins can download resumes.
// The filename is sanitised to prevent path traversal attacks.
router.get('/:filename', auth, (req, res) => {
  // Sanitise: strip any path separators to prevent directory traversal
  // e.g. ../../etc/passwd becomes etcpasswd — harmless
  const filename = path.basename(req.params.filename);
  const filePath = path.join(privateResumeDir, filename);

  // Check file exists before attempting to serve it
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Resume not found.' });
  }

  // Send file as a download attachment
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Resume download error:', err.message);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download resume.' });
      }
    }
  });
});

module.exports = router;
