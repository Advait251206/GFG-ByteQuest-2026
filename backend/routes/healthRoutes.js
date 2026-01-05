const express = require('express');
const router = express.Router();
const { getHealthData, updateMetrics } = require('../controllers/healthController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getHealthData);
router.post('/metrics', protect, updateMetrics);

module.exports = router;
