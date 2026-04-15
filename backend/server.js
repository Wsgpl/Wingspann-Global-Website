require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// ── Existing routes ───────────────────────────────────────────────────────────
const contactRouter      = require('./routes/contact');
const applyRouter        = require('./routes/apply');
const careersRouter      = require('./routes/careers');
const socialLinksRouter  = require('./routes/social-links');

// ── Admin routes ──────────────────────────────────────────────────────────────
const adminAuthRouter        = require('./routes/admin/auth');
const newsRouter             = require('./routes/admin/news');
const technologyRouter       = require('./routes/admin/technology');
const productsRouter         = require('./routes/admin/products');
const uploadRouter           = require('./routes/admin/upload');
const adminCareersRouter     = require('./routes/admin/careers');
const adminSocialLinksRouter = require('./routes/admin/social-links');
const adminSettingsRouter    = require('./routes/admin/settings');
const resumesRouter          = require('./routes/admin/resumes'); // ← NEW

const app = express();
const PORT = process.env.PORT || 5000;
const SPACE_VIEWER_FILES = ['space-showcase.html', 'space-6u.html', 'space-12u.html'];

app.set('trust proxy', 1);

app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
  next();
});

// ── FIX 5: Helmet — adds X-Frame-Options, CSP, and 12 other security headers ─
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'https://cdnjs.cloudflare.com',
        (req, res) => `'nonce-${res.locals.cspNonce}'`,
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://cdn.fontshare.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      mediaSrc: ["'self'", "blob:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

function injectNonceIntoHtml(html, nonce) {
  return html.replace(/<script\b(?![^>]*\bnonce=)/gi, `<script nonce="${nonce}"`);
}

function resolveSpaceViewerPath(filename) {
  const distFile = path.join(__dirname, '../frontend/dist', filename);
  if (fs.existsSync(distFile)) return distFile;
  return path.join(__dirname, '../frontend/public', filename);
}

SPACE_VIEWER_FILES.forEach((filename) => {
  app.get(`/${filename}`, async (req, res) => {
    try {
      const htmlPath = resolveSpaceViewerPath(filename);
      const html = await fs.promises.readFile(htmlPath, 'utf8');
      res.type('html').send(injectNonceIntoHtml(html, res.locals.cspNonce));
    } catch (error) {
      res.status(404).send('Viewer not found.');
    }
  });
});

// ── Cookie parser — needed for HttpOnly JWT cookies ───────────────────────────
app.use(cookieParser());

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// ── FIX 4: Rate limiters ──────────────────────────────────────────────────────
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many submissions. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const applyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many applications. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// ── Serve uploaded MEDIA files publicly (images/videos only) ─────────────────
// NOTE: resumes are NOT in this folder — they are in private/resumes/
// and only accessible via the protected /api/admin/resumes/:filename route
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Public API routes ─────────────────────────────────────────────────────────
app.use('/api/contact',      contactLimiter, contactRouter);
app.use('/api/apply',        applyLimiter,   applyRouter);
app.use('/api/careers',      careersRouter);
app.use('/api/news',         newsRouter);
app.use('/api/technology',   technologyRouter);
app.use('/api/products',     productsRouter);
app.use('/api/social-links', socialLinksRouter);

// ── Admin routes ──────────────────────────────────────────────────────────────
app.use('/api/admin',                adminAuthRouter);
app.use('/api/admin/upload',         uploadRouter);
app.use('/api/admin/careers',        adminCareersRouter);
app.use('/api/admin/social-links',   adminSocialLinksRouter);
app.use('/api/admin/settings',       adminSettingsRouter);
app.use('/api/admin/resumes',        resumesRouter); // ← NEW: protected resume downloads

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Serve React frontend in production ────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ── Start ─────────────────────────────────────────────────────────────────────
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Wingspann backend running on port ${PORT}`);
});
