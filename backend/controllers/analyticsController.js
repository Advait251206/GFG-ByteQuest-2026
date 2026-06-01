const { predictHealthTrends } = require('../services/riskPredictionService');

// @desc    Get AI-driven health forecast
// @route   GET /api/analytics/forecast/:userId
// @access  Private
const getHealthForecast = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Security check: Ensure querying own data (unless admin - future scope)
        if (req.user._id.toString() !== userId) {
            return res.status(401).json({ message: 'Not authorized to view this data' });
        }

        const prediction = await predictHealthTrends(userId);
        res.json(prediction);
    } catch (error) {
        console.error("Forecast Error:", error);
        res.status(500).json({ message: 'Failed to generate forecast' });
    }
};

module.exports = { getHealthForecast };
