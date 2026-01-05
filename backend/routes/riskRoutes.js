const express = require('express');
const router = express.Router();
const { analyzeRisk } = require('../controllers/riskController');

router.post('/analyze', analyzeRisk);

module.exports = router;
