const express = require('express');
const router = express.Router();
const { getPublishedCareerPositions } = require('../db/careerPositions');

router.get('/positions', async (req, res) => {
  try {
    const positions = await getPublishedCareerPositions();
    res.json(positions);
  } catch (err) {
    console.error('Failed to fetch career positions:', err.message);
    res.status(500).json({ error: 'Failed to fetch career positions.' });
  }
});

module.exports = router;
