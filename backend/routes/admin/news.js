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

// ── Lazy table-bootstrap (unchanged from original) ───────────────────────────
let ensurePromise = null;

const REQUIRED_NEWS_COLUMNS = [
  'id',
  'title',
  'summary',
  'content',
  'source',
  'source_url',
  'image_url',
  'video_url',
  'extra_videos',
  'published_at',
  'is_published',
  'created_at',
  'updated_at',
];

async function ensureNewsTable() {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      const [tables] = await db.query("SHOW TABLES LIKE 'news'");
      if (!tables.length) {
        throw new Error('Missing required table "news". Run backend/db/migrate-news.sql.');
      }

      const [columns] = await db.query('SHOW COLUMNS FROM news');
      const availableColumns = new Set(columns.map((column) => column.Field));
      const missingColumns = REQUIRED_NEWS_COLUMNS.filter((column) => !availableColumns.has(column));

      if (missingColumns.length > 0) {
        throw new Error(`The news table is missing columns: ${missingColumns.join(', ')}. Run backend/db/migrate-news.sql.`);
      }
    })();
  }
  return ensurePromise;
}

// ── URL / path helpers (unchanged) ───────────────────────────────────────────
function getRequestBaseUrl(req) {
  const configuredBase = process.env.PUBLIC_API_URL || process.env.API_URL || '';
  if (configuredBase) return configuredBase.replace(/\/$/, '');
  return `${req.protocol}://${req.get('host')}`;
}

function resolvePublicUrl(value, req) {
  if (typeof value !== 'string' || value.trim() === '') return value;
  const url = value.trim();
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/uploads/')) return `${getRequestBaseUrl(req)}${url}`;
  return url;
}

function parseExtraVideos(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeExtraVideos(value) {
  const videos = parseExtraVideos(value)
    .filter(video => typeof video === 'string' && video.trim())
    .map(video => video.trim());
  return videos.length > 0 ? JSON.stringify(videos) : null;
}

function mapPublicNews(row, req) {
  const extraVideos = parseExtraVideos(row.extra_videos)
    .map(video => resolvePublicUrl(video, req))
    .filter(Boolean);
  return {
    ...row,
    image_url: resolvePublicUrl(row.image_url, req),
    video_url: resolvePublicUrl(row.video_url, req),
    extra_videos: extraVideos,
  };
}

function preventNewsCache(res) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
}

// ── Field validators ─────────────────────────────────────────────────────────
// Accepts absolute HTTPS URLs or relative /uploads/ paths (for internally
// stored media). Empty / omitted values are allowed for all media fields.
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

const newsWriteValidators = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required.')
    .isLength({ max: 500 }).withMessage('Title must be 500 characters or fewer.'),

  body('summary')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 3000 }).withMessage('Summary must be 3,000 characters or fewer.'),

  body('content')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100000 }).withMessage('Content must be 100,000 characters or fewer.'),

  body('source')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 }).withMessage('Source must be 255 characters or fewer.'),

  body('source_url')
    .optional({ checkFalsy: true })
    .trim()
    .isURL({ require_protocol: true }).withMessage('source_url must be a valid URL.')
    .isLength({ max: 1000 }).withMessage('source_url must be 1,000 characters or fewer.'),

  isMediaUrl('image_url'),
  isMediaUrl('video_url'),

  body('extra_videos')
    .optional()
    .custom((value) => {
      const list = typeof value === 'string' ? JSON.parse(value) : value;
      if (!Array.isArray(list)) throw new Error('extra_videos must be an array.');
      if (list.length > 20) throw new Error('extra_videos may contain at most 20 entries.');
      list.forEach((v, i) => {
        if (typeof v !== 'string' || v.trim() === '') {
          throw new Error(`extra_videos[${i}] must be a non-empty string.`);
        }
        if (v.length > 1000) {
          throw new Error(`extra_videos[${i}] must be 1,000 characters or fewer.`);
        }
      });
      return true;
    }),

  body('published_at')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('published_at must be a valid ISO 8601 date (YYYY-MM-DD).'),

  body('is_published')
    .optional()
    .isBoolean().withMessage('is_published must be a boolean.')
    .toBoolean(),
];

// ── Numeric :id param validator ──────────────────────────────────────────────
const idParam = param('id')
  .isInt({ min: 1 }).withMessage('Article ID must be a positive integer.')
  .toInt();

// ── Routes ───────────────────────────────────────────────────────────────────

// Public: get all published news.
router.get('/', async (req, res) => {
  try {
    await ensureNewsTable();
    preventNewsCache(res);
    const [rows] = await db.execute(
      'SELECT * FROM news WHERE is_published = 1 ORDER BY published_at DESC'
    );
    res.json(rows.map(row => mapPublicNews(row, req)));
  } catch (err) {
    console.error('Failed to fetch news:', err.message);
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
});

// Admin: get all news including drafts.
router.get('/all', auth, async (req, res) => {
  try {
    await ensureNewsTable();
    preventNewsCache(res);
    const [rows] = await db.execute('SELECT * FROM news ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch admin news:', err.message);
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
});

// Admin: create news article.
router.post('/', auth, newsWriteValidators, validate, async (req, res) => {
  const {
    title, summary, content, source, source_url,
    image_url, video_url, extra_videos,
    published_at, is_published,
  } = req.body;

  try {
    await ensureNewsTable();
    const [result] = await db.execute(
      `INSERT INTO news
        (title, summary, content, source, source_url, image_url, video_url, extra_videos, published_at, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        summary || null,
        content || null,
        source || null,
        source_url || null,
        image_url || null,
        video_url || null,
        normalizeExtraVideos(extra_videos),
        published_at || null,
        is_published ?? 1,
      ]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Failed to create news article:', err.message);
    res.status(500).json({ error: 'Failed to create news article.' });
  }
});

// Admin: update news article.
router.put('/:id', auth, idParam, newsWriteValidators, validate, async (req, res) => {
  const {
    title, summary, content, source, source_url,
    image_url, video_url, extra_videos,
    published_at, is_published,
  } = req.body;

  try {
    await ensureNewsTable();
    await db.execute(
      `UPDATE news SET
        title = ?,
        summary = ?,
        content = ?,
        source = ?,
        source_url = ?,
        image_url = ?,
        video_url = ?,
        extra_videos = ?,
        published_at = ?,
        is_published = ?
       WHERE id = ?`,
      [
        title,
        summary || null,
        content || null,
        source || null,
        source_url || null,
        image_url || null,
        video_url || null,
        normalizeExtraVideos(extra_videos),
        published_at || null,
        is_published ?? 1,
        req.params.id,
      ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update news article:', err.message);
    res.status(500).json({ error: 'Failed to update news article.' });
  }
});

// Admin: delete news article.
router.delete('/:id', auth, idParam, validate, async (req, res) => {
  try {
    await ensureNewsTable();
    await db.execute('DELETE FROM news WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete news article:', err.message);
    res.status(500).json({ error: 'Failed to delete news article.' });
  }
});

module.exports = router;
