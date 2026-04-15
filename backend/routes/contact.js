const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../db');
const { sendContactEmail } = require('../mailer');

// Keep contact attachments in memory so they only live long enough to be emailed.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Invalid file type.'));
  },
});

// ── Validation middleware helper ─────────────────────────────────────────────
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }
  next();
}

// ── Field validators ─────────────────────────────────────────────────────────
const contactValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ max: 200 }).withMessage('Name must be 200 characters or fewer.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Invalid email address.')
    .isLength({ max: 254 }).withMessage('Email must be 254 characters or fewer.')
    .normalizeEmail(),

  body('org')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }).withMessage('Organisation must be 200 characters or fewer.'),

  body('subject')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 300 }).withMessage('Subject must be 300 characters or fewer.'),

  body('inquiryType')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Inquiry type must be 100 characters or fewer.'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required.')
    .isLength({ max: 5000 }).withMessage('Message must be 5,000 characters or fewer.'),
];

// ── Route ────────────────────────────────────────────────────────────────────
router.post('/', (req, res, next) => {
  upload.single('attachment')(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Attachment must be 5 MB or smaller.' });
    }
    return res.status(400).json({ error: err.message || 'Invalid attachment.' });
  });
}, contactValidators, validate, async (req, res) => {
  // body fields are already sanitised (trimmed, normalised) by express-validator
  const { name, email, org, subject, inquiryType, message } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO contact_submissions
        (name, email, org, subject, inquiry_type, message, routed_to)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, org || null, subject || null, inquiryType || null, message, null]
    );

    const routedTo = await sendContactEmail(
      { name, email, org, subject, inquiryType, message },
      req.file || null
    );

    await db.execute(
      'UPDATE contact_submissions SET routed_to = ? WHERE id = ?',
      [routedTo, result.insertId]
    );

    return res.status(200).json({ success: true, message: 'Your message has been sent.' });
  } catch (err) {
    console.error('Contact route error:', err.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
