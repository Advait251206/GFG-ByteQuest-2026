const express = require('express');
const router = express.Router();
const { getHealthForecast } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/forecast/:userId', protect, getHealthForecast);

module.exports = router;
