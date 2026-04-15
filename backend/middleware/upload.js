const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ── Private resume storage — NOT publicly served ──────────────────────────────
// Resumes are stored outside the public uploads/ folder so they cannot be
// accessed by anyone who guesses the filename. Only authenticated admin
// requests can download them via GET /api/admin/resumes/:filename
const privateResumeDir = path.join(__dirname, '../private/resumes');
if (!fs.existsSync(privateResumeDir)) fs.mkdirSync(privateResumeDir, { recursive: true });

// ── Public uploads dir (for admin media — images/videos only) ────────────────
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ── Magic byte validation ─────────────────────────────────────────────────────
// We check actual file bytes (not just extension) to prevent attackers from
// renaming exploit.php as exploit.pdf to bypass the filter.
//
// DOCX/XLSX/PPTX are ZIP-based. ZIP has three valid local file header signatures:
//   50 4B 03 04 — normal entry
//   50 4B 05 06 — end-of-central-directory (empty archive)
//   50 4B 07 08 — spanned archive
// We accept all three so valid DOCX files are never rejected.
//
// PDF: spec allows %PDF within the first 1024 bytes, not necessarily at byte 0.
// We scan the first 1024 bytes to handle PDF generators that add a BOM first.

function validateMagicBytes(buffer) {
  const header = buffer.slice(0, 8);

  // ── PDF: scan first 1024 bytes for %PDF ──────────────────────────────────
  const scanArea = buffer.slice(0, Math.min(1024, buffer.length)).toString('binary');
  if (scanArea.includes('%PDF')) {
    return { ext: '.pdf', mime: 'application/pdf' };
  }

  // ── DOC: OLE2 compound document — D0 CF 11 E0 ────────────────────────────
  if (
    header[0] === 0xD0 &&
    header[1] === 0xCF &&
    header[2] === 0x11 &&
    header[3] === 0xE0
  ) {
    return { ext: '.doc', mime: 'application/msword' };
  }

  // ── DOCX: ZIP-based — accept all three PK header variants ────────────────
  if (header[0] === 0x50 && header[1] === 0x4B) {
    const third = header[2];
    const fourth = header[3];
    const isValidZip =
      (third === 0x03 && fourth === 0x04) ||
      (third === 0x05 && fourth === 0x06) ||
      (third === 0x07 && fourth === 0x08);
    if (isValidZip) {
      return {
        ext: '.docx',
        mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };
    }
  }

  return null; // unrecognised — reject
}

// ── Multer: memory storage so we can inspect bytes before saving ──────────────
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed.'), false);
  }
};

const uploadMemory = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// ── resumeUpload: validates magic bytes then saves to PRIVATE folder ──────────
function resumeUpload(fieldName) {
  return [
    uploadMemory.single(fieldName),

    (req, res, next) => {
      if (!req.file) return next(); // resume is optional

      const detectedType = validateMagicBytes(req.file.buffer);
      if (!detectedType) {
        return res.status(400).json({
          error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.',
        });
      }

      // Sanitise filename and save to PRIVATE directory
      const timestamp = Date.now();
      const safe = req.file.originalname
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '');
      const filename = `${timestamp}_${safe}`;
      const filePath = path.join(privateResumeDir, filename);

      fs.writeFile(filePath, req.file.buffer, (err) => {
        if (err) {
          console.error('Failed to save resume:', err);
          return res.status(500).json({ error: 'Failed to save uploaded file.' });
        }
        req.file.path = filePath;
        req.file.filename = filename;
        next();
      });
    },
  ];
}

module.exports = { resumeUpload };
