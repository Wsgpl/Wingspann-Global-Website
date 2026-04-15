const express = require('express');
const router = express.Router();
const { getSocialLinksSettings } = require('../db/socialLinksSettings');

router.get('/', async (req, res) => {
  try {
    const settings = await getSocialLinksSettings();
    res.json(settings);
  } catch (err) {
    console.error('Failed to fetch social links settings:', err.message);
    res.status(500).json({ error: 'Failed to fetch social links settings.' });
  }
});

module.exports = router;
