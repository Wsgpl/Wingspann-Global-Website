const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../db');

// Auth guard that reads the existing HttpOnly admin cookie.
function requireAuth(req, res, next) {
  const token = req.cookies?.admin_token;
  if (!token) return res.status(401).json({ error: 'Not authenticated.' });

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
}

// PUT /api/admin/settings/credentials
router.put('/credentials', requireAuth, async (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required.' });
  }
  if (!newUsername && !newPassword) {
    return res.status(400).json({ error: 'Provide a new username or new password.' });
  }
  if (newPassword && newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters.' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT * FROM admin_users WHERE id = ?',
      [req.admin.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found.' });

    const user = rows[0];
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) return res.status(403).json({ error: 'Current password is incorrect.' });

    if (newUsername && newUsername !== user.username) {
      const [existing] = await db.execute(
        'SELECT id FROM admin_users WHERE username = ? AND id != ?',
        [newUsername, user.id]
      );
      if (existing.length > 0) {
        return res.status(409).json({ error: 'That username is already taken.' });
      }
    }

    const updates = [];
    const params = [];

    if (newUsername && newUsername !== user.username) {
      updates.push('username = ?');
      params.push(newUsername);
    }
    if (newPassword) {
      const hash = await bcrypt.hash(newPassword, 12);
      updates.push('password_hash = ?');
      params.push(hash);
    }

    if (updates.length === 0) {
      return res.json({ success: true, message: 'Nothing changed.' });
    }

    params.push(user.id);
    await db.execute(
      `UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const updatedUsername = newUsername || user.username;
    const token = jwt.sign(
      { id: user.id, username: updatedUsername },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 8 * 60 * 60 * 1000,
      path: '/',
    });

    return res.json({ success: true, username: updatedUsername });
  } catch (err) {
    console.error('Settings error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
