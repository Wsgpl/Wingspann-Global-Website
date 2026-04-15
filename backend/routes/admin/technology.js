const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../../db');
const auth = require('../../middleware/auth');

// ── Validation middleware helper ─────────────────────────────────────────────
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }
  next();
}

// ── Constants ────────────────────────────────────────────────────────────────
const VALID_CATEGORIES = ['uas', 'space', 'aerospace', 'optical'];

// ── Field validators ─────────────────────────────────────────────────────────
const technologyWriteValidators = [
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required.')
    .isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}.`),

  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .isLength({ max: 300 }).withMessage('Title must be 300 characters or fewer.'),

  body('subtitle')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 300 }).withMessage('Subtitle must be 300 characters or fewer.'),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20000 }).withMessage('Description must be 20,000 characters or fewer.'),

  body('specs')
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') return true;
      // Accept pre-parsed objects/arrays or JSON strings
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('specs must be a JSON object or array.');
      }
      return true;
    }),

  body('image_url')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => {
      if (!value) return true;
      const isAbsolute = /^https?:\/\//i.test(value);
      const isUploadPath = value.startsWith('/uploads/');
      if (!isAbsolute && !isUploadPath) {
        throw new Error('image_url must be an absolute URL or an /uploads/ path.');
      }
      return true;
    })
    .isLength({ max: 1000 }).withMessage('image_url must be 1,000 characters or fewer.'),

  body('sort_order')
    .optional()
    .isInt({ min: 0 }).withMessage('sort_order must be a non-negative integer.')
    .toInt(),

  body('is_published')
    .optional()
    .isBoolean().withMessage('is_published must be a boolean.')
    .toBoolean(),
];

// ── Numeric :id param validator ──────────────────────────────────────────────
const idParam = param('id')
  .isInt({ min: 1 }).withMessage('Item ID must be a positive integer.')
  .toInt();

// ── :category param validator (public route) ─────────────────────────────────
const categoryParam = param('category')
  .trim()
  .isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}.`);

// ── Routes ───────────────────────────────────────────────────────────────────

// Public: get by category
router.get('/:category', categoryParam, validate, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM technology_items WHERE category = ? AND is_published = 1 ORDER BY sort_order ASC',
      [req.params.category]
    );
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch technology items:', err.message);
    res.status(500).json({ error: 'Failed to fetch technology items.' });
  }
});

// Admin: get all
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM technology_items ORDER BY category, sort_order');
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch technology items:', err.message);
    res.status(500).json({ error: 'Failed to fetch technology items.' });
  }
});

// Admin: create
router.post('/', auth, technologyWriteValidators, validate, async (req, res) => {
  const { category, title, subtitle, description, specs, image_url, sort_order, is_published } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO technology_items (category, title, subtitle, description, specs, image_url, sort_order, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category, title,
        subtitle || null,
        description || null,
        specs ? JSON.stringify(specs) : null,
        image_url || null,
        sort_order ?? 0,
        is_published ?? 1,
      ]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Failed to create technology item:', err.message);
    res.status(500).json({ error: 'Failed to create technology item.' });
  }
});

// Admin: update
router.put('/:id', auth, idParam, technologyWriteValidators, validate, async (req, res) => {
  const { category, title, subtitle, description, specs, image_url, sort_order, is_published } = req.body;

  try {
    await db.execute(
      `UPDATE technology_items SET category=?, title=?, subtitle=?, description=?,
       specs=?, image_url=?, sort_order=?, is_published=? WHERE id=?`,
      [
        category, title,
        subtitle || null,
        description || null,
        specs ? JSON.stringify(specs) : null,
        image_url || null,
        sort_order ?? 0,
        is_published ?? 1,
        req.params.id,
      ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update technology item:', err.message);
    res.status(500).json({ error: 'Failed to update technology item.' });
  }
});

// Admin: delete
router.delete('/:id', auth, idParam, validate, async (req, res) => {
  try {
    await db.execute('DELETE FROM technology_items WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete technology item:', err.message);
    res.status(500).json({ error: 'Failed to delete technology item.' });
  }
});

module.exports = router;
