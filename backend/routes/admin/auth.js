const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const db = require('../../db');
const auth = require('../../middleware/auth');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/admin/login
// ── FIX 2: JWT now sent as HttpOnly cookie instead of JSON body ───────────────
// This prevents the token from being accessible via JavaScript (localStorage),
// which was the session hijacking vector in the VAPT report.

router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      // Same error message for both wrong username and wrong password
      // to prevent username enumeration
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // ── Send token as HttpOnly cookie — JS cannot read this ──────────────────
    res.cookie('admin_token', token, {
      httpOnly: true,                                          // not accessible via JS
      secure: process.env.NODE_ENV === 'production',          // HTTPS only in prod
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 8 * 60 * 60 * 1000,                            // 8 hours in ms
      path: '/',
    });

    // Return username only — no token in response body
    return res.json({ success: true, username: user.username });

  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/admin/me
router.get('/me', auth, (req, res) => {
  res.json({ username: req.user.username });
});

// POST /api/admin/logout
router.post('/logout', (req, res) => {
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
  });
  res.json({ success: true });
});

module.exports = router;
