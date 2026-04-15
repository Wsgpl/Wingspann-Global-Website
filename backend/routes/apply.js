const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../db');
const { sendApplyEmail } = require('../mailer');
const { resumeUpload } = require('../middleware/upload');

// ── Validation middleware helper ─────────────────────────────────────────────
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }
  next();
}

// ── Field validators ─────────────────────────────────────────────────────────
const applyValidators = [
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

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    // Allow digits, spaces, +, -, (, ) — reject anything else
    .matches(/^[0-9\s\+\-\(\)]+$/).withMessage('Phone number contains invalid characters.')
    .isLength({ max: 30 }).withMessage('Phone must be 30 characters or fewer.'),

  body('position')
    .trim()
    .notEmpty().withMessage('Position is required.')
    .isLength({ max: 300 }).withMessage('Position must be 300 characters or fewer.'),

  body('department')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }).withMessage('Department must be 200 characters or fewer.'),

  body('coverLetter')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 5000 }).withMessage('Cover letter must be 5,000 characters or fewer.'),
];

// ── Route ────────────────────────────────────────────────────────────────────
// resumeUpload validates magic bytes before saving — see middleware/upload.js
router.post('/', resumeUpload('resume'), applyValidators, validate, async (req, res) => {
  const { name, email, phone, position, department, coverLetter } = req.body;
  const resumeFile = req.file;

  try {
    await db.execute(
      `INSERT INTO career_applications
        (name, email, phone, position, department, resume_filename, resume_path, cover_letter, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'received')`,
      [
        name,
        email,
        phone || null,
        position,
        department || null,
        resumeFile ? resumeFile.originalname : null,
        resumeFile ? resumeFile.path : null,
        coverLetter || null,
      ]
    );

    await sendApplyEmail(
      { name, email, phone, position, department, coverLetter },
      resumeFile ? resumeFile.path : null
    );

    return res.status(200).json({ success: true, message: 'Application submitted successfully.' });
  } catch (err) {
    console.error('Apply route error:', err.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
