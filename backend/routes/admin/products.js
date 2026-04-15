const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../../db');
const auth = require('../../middleware/auth');
const { ensureProductsTable, normalizeProductPayload } = require('../../db/productCatalog');

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

// ── URL / path helpers (unchanged) ───────────────────────────────────────────
function getRequestBaseUrl(req) {
  const configuredBase = process.env.PUBLIC_API_URL || process.env.API_URL || '';
  if (configuredBase) return configuredBase.replace(/\/$/, '');
  return `${req.protocol}://${req.get('host')}`;
}

function resolvePublicUrl(value, req) {
  if (!value || typeof value !== 'string' || value.trim() === '') return null;
  const url = value.trim();
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/uploads/')) return `${getRequestBaseUrl(req)}${url}`;
  return url;
}

function mapPublicProduct(row, req) {
  return {
    ...row,
    image_url: resolvePublicUrl(row.image_url, req),
    model_url: resolvePublicUrl(row.model_url, req),
  };
}

function preventProductCache(res) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
}

// ── Field validators ─────────────────────────────────────────────────────────
// Accepts absolute HTTPS URLs or relative /uploads/ paths.
function isMediaUrl(fieldName) {
  return body(fieldName)
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => {
      if (!value) return true;
      const isAbsolute = /^https?:\/\//i.test(value);
      const isUploadPath = value.startsWith('/uploads/');
      if (!isAbsolute && !isUploadPath) {
        throw new Error(`${fieldName} must be an absolute URL or an /uploads/ path.`);
      }
      return true;
    })
    .isLength({ max: 1000 }).withMessage(`${fieldName} must be 1,000 characters or fewer.`);
}

// Validates that a body field is either absent or a valid JSON array / already
// an array; prevents the database from receiving malformed JSON strings.
function isJsonArray(fieldName) {
  return body(fieldName)
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') return true;
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      if (!Array.isArray(parsed)) throw new Error(`${fieldName} must be an array.`);
      return true;
    });
}

function isJsonObject(fieldName) {
  return body(fieldName)
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === '') return true;
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      const isPlainObject = typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
      if (!isPlainObject) throw new Error(`${fieldName} must be an object.`);
      return true;
    });
}

const productWriteValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ max: 300 }).withMessage('Name must be 300 characters or fewer.'),

  body('slug')
    .trim()
    .notEmpty().withMessage('Slug is required.')
    .isLength({ max: 300 }).withMessage('Slug must be 300 characters or fewer.')
    // Slugs: lowercase letters, digits, hyphens only — no spaces or special chars
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug may only contain lowercase letters, digits, and hyphens, and must not start or end with a hyphen.'),

  body('category')
    .optional({ checkFalsy: true })
    .trim()
    .isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}.`),

  body('tagline')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Tagline must be 500 characters or fewer.'),

  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20000 }).withMessage('Description must be 20,000 characters or fewer.'),

  body('status')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Status must be 100 characters or fewer.'),

  isMediaUrl('image_url'),
  isMediaUrl('model_url'),

  isJsonArray('specs'),
  isJsonArray('features'),
  isJsonObject('detail_sections'),

  body('sort_order')
    .optional()
    .isInt({ min: 0 }).withMessage('sort_order must be a non-negative integer.')
    .toInt(),

  body('is_published')
    .optional()
    .isBoolean().withMessage('is_published must be a boolean.')
    .toBoolean(),
];

// ── Validators for query params ──────────────────────────────────────────────
const categoryQueryValidator = [
  query('category')
    .optional({ checkFalsy: true })
    .trim()
    .isIn(VALID_CATEGORIES).withMessage(`category query must be one of: ${VALID_CATEGORIES.join(', ')}.`),
];

// ── Numeric :id param validator ──────────────────────────────────────────────
const idParam = param('id')
  .isInt({ min: 1 }).withMessage('Product ID must be a positive integer.')
  .toInt();

// ── Routes ───────────────────────────────────────────────────────────────────

// FIX: /admin/all MUST be declared BEFORE /:slug — see original comment.

// Admin: get all products
router.get('/admin/all', auth, async (req, res) => {
  try {
    await ensureProductsTable();
    preventProductCache(res);
    const [rows] = await db.execute(
      "SELECT * FROM products ORDER BY FIELD(category, 'uas', 'space', 'aerospace', 'optical'), sort_order ASC, created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch admin products:', err.message);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// Public: get all published products
router.get('/', categoryQueryValidator, validate, async (req, res) => {
  try {
    await ensureProductsTable();
    preventProductCache(res);
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const params = [];
    let sql = 'SELECT * FROM products WHERE is_published = 1';

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += " ORDER BY FIELD(category, 'uas', 'space', 'aerospace', 'optical'), sort_order ASC, created_at DESC";

    const [rows] = await db.execute(sql, params);
    res.json(rows.map(row => mapPublicProduct(row, req)));
  } catch (err) {
    console.error('Failed to fetch products:', err.message);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// Public: get single product by slug — MUST be after /admin/all
router.get('/:slug',
  param('slug')
    .trim()
    .notEmpty().withMessage('Slug is required.')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Invalid slug format.')
    .isLength({ max: 300 }).withMessage('Slug too long.'),
  validate,
  async (req, res) => {
    try {
      await ensureProductsTable();
      preventProductCache(res);
      const [rows] = await db.execute(
        'SELECT * FROM products WHERE slug = ? AND is_published = 1',
        [req.params.slug]
      );
      if (rows.length === 0) return res.status(404).json({ error: 'Product not found.' });
      res.json(mapPublicProduct(rows[0], req));
    } catch (err) {
      console.error('Failed to fetch product:', err.message);
      res.status(500).json({ error: 'Failed to fetch product.' });
    }
  }
);

// Admin: create product
router.post('/', auth, productWriteValidators, validate, async (req, res) => {
  const product = normalizeProductPayload(req.body);

  try {
    await ensureProductsTable();
    const [result] = await db.execute(
      `INSERT INTO products
        (name, slug, category, tagline, description, specs, features, detail_sections, status, image_url, model_url, sort_order, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.name, product.slug, product.category,
        product.tagline || null, product.description || null,
        JSON.stringify(product.specs), JSON.stringify(product.features),
        JSON.stringify(product.detail_sections), product.status,
        product.image_url || null, product.model_url || null,
        product.sort_order, product.is_published,
      ]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'A product with this slug already exists.' });
    }
    console.error('Failed to create product:', err.message);
    res.status(500).json({ error: 'Failed to create product.' });
  }
});

// Admin: update product
router.put('/:id', auth, idParam, productWriteValidators, validate, async (req, res) => {
  const product = normalizeProductPayload(req.body);

  try {
    await ensureProductsTable();
    await db.execute(
      `UPDATE products SET
        name=?, slug=?, category=?, tagline=?, description=?,
        specs=?, features=?, detail_sections=?, status=?,
        image_url=?, model_url=?, sort_order=?, is_published=?
       WHERE id=?`,
      [
        product.name, product.slug, product.category,
        product.tagline || null, product.description || null,
        JSON.stringify(product.specs), JSON.stringify(product.features),
        JSON.stringify(product.detail_sections), product.status,
        product.image_url || null, product.model_url || null,
        product.sort_order, product.is_published, req.params.id,
      ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update product:', err.message);
    res.status(500).json({ error: 'Failed to update product.' });
  }
});

// Admin: delete product
router.delete('/:id', auth, idParam, validate, async (req, res) => {
  try {
    await ensureProductsTable();
    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete product:', err.message);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
});

module.exports = router;
