const ss = require('simple-statistics');
const HealthData = require('../models/HealthData');

/**
 * Predicts health trends for the next 7 days based on historical data.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Object>} - Object containing history, forecast, and risk velocity.
 */
const predictHealthTrends = async (userId) => {
    // 1. Fetch last 30 days of health data, sorted by date (ascending)
    const history = await HealthData.find({ userId })
        .sort({ timestamp: 1 })
        .limit(30);

    if (history.length < 2) {
        return { history, forecast: [], riskVelocity: 0, message: "Not enough data for prediction" };
    }

    // 2. Prepare data for regression (x = time index, y = metric)
    // We'll focus on Risk Score if available, otherwise calculate a composite metric
    const dataPoints = history.map((entry, index) => {
        // Use pre-calculated riskScore or derive generic "strain" from Heart Rate + Stress
        // Fallback: If riskScore is missing, use normalized heart rate (simple proxy)
        const metric = entry.riskScore || (entry.metrics?.heartRate || 70); 
        return [index, metric];
    });

    // 3. Calculate Linear Regression
    const { m, b } = ss.linearRegression(dataPoints);
    const regressionLine = ss.linearRegressionLine({ m, b });

    // 4. Forecast next 7 days
    const lastIndex = dataPoints.length - 1;
    const forecast = [];
    for (let i = 1; i <= 7; i++) {
        const futureIndex = lastIndex + i;
        const predictedValue = regressionLine(futureIndex);
        
        // Clamp values reasonably (0-100 for risk)
        const clampedValue = Math.max(0, Math.min(100, predictedValue));
        
        forecast.push({
            day: `Day +${i}`,
            risk: Math.round(clampedValue)
        });
    }

    // 5. Calculate "Risk Velocity" (Slope m)
    // m > 0 means risk is increasing. m < 0 means risk is decreasing.
    // We scale it up for readability (e.g., change per week)
    const riskVelocity = m * 7; // Weekly trend

    return {
        history: history.map(h => {
             // Robust date finding: prefer explicit timestamp, then createdAt, then extract from ObjectId
             const dateVal = h.timestamp || h.createdAt || (h._id && h._id.getTimestamp());
             return { 
                date: dateVal, 
                risk: h.riskScore || (h.metrics?.heartRate || 70) 
            };
        }),
        forecast,
        riskVelocity
    };
};

module.exports = { predictHealthTrends };
