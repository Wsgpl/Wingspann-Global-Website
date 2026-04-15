const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
  getAllCareerPositions,
  createCareerPosition,
  updateCareerPosition,
  deleteCareerPosition,
} = require('../../db/careerPositions');

// ── Validation middleware helper ─────────────────────────────────────────────
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }
  next();
}

// ── Shared body validators for create / update ───────────────────────────────
const careerPositionValidators = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .isLength({ max: 300 }).withMessage('Title must be 300 characters or fewer.'),

  body('department')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }).withMessage('Department must be 200 characters or fewer.'),

  body('location')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }).withMessage('Location must be 200 characters or fewer.'),

  body('type')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Type must be 100 characters or fewer.'),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20000 }).withMessage('Description must be 20,000 characters or fewer.'),

  body('requirements')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 10000 }).withMessage('Requirements must be 10,000 characters or fewer.'),

  body('is_published')
    .optional()
    .isBoolean().withMessage('is_published must be a boolean.')
    .toBoolean(),

  body('sort_order')
    .optional()
    .isInt({ min: 0 }).withMessage('sort_order must be a non-negative integer.')
    .toInt(),
];

// ── Numeric :id param validator ──────────────────────────────────────────────
const idParam = param('id')
  .isInt({ min: 1 }).withMessage('Position ID must be a positive integer.')
  .toInt();

// ── Routes ───────────────────────────────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const positions = await getAllCareerPositions();
    res.json(positions);
  } catch (err) {
    console.error('Failed to fetch admin career positions:', err.message);
    res.status(500).json({ error: 'Failed to fetch career positions.' });
  }
});

router.post('/', auth, careerPositionValidators, validate, async (req, res) => {
  try {
    const position = await createCareerPosition(req.body);
    res.status(201).json({ success: true, id: position.id, position });
  } catch (err) {
    console.error('Failed to create career position:', err.message);
    res.status(500).json({ error: 'Failed to create career position.' });
  }
});

router.put('/:id', auth, idParam, careerPositionValidators, validate, async (req, res) => {
  try {
    const position = await updateCareerPosition(req.params.id, req.body);
    res.json({ success: true, position });
  } catch (err) {
    console.error('Failed to update career position:', err.message);
    res.status(500).json({ error: 'Failed to update career position.' });
  }
});

router.delete('/:id', auth, idParam, validate, async (req, res) => {
  try {
    await deleteCareerPosition(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete career position:', err.message);
    res.status(500).json({ error: 'Failed to delete career position.' });
  }
});

module.exports = router;
