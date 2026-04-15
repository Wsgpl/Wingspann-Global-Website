const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
  getSocialLinksSettings,
  saveSocialLinksSettings,
} = require('../../db/socialLinksSettings');

router.get('/', auth, async (req, res) => {
  try {
    const settings = await getSocialLinksSettings();
    res.json(settings);
  } catch (err) {
    console.error('Failed to fetch admin social links settings:', err.message);
    res.status(500).json({ error: 'Failed to fetch social links settings.' });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const settings = await saveSocialLinksSettings(req.body);
    res.json({ success: true, settings });
  } catch (err) {
    console.error('Failed to save admin social links settings:', err.message);
    res.status(500).json({ error: 'Failed to save social links settings.' });
  }
});

module.exports = router;
