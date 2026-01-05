const HealthData = require('../models/HealthData');

// @desc    Calculate risk score based on health data
// @route   POST /api/risk/analyze
// @access  Public (for prototype)
const analyzeRisk = async (req, res) => {
  const { metrics, labResults, familyHistory } = req.body;

  // Mock Risk Calculation Logic
  // In a real app, this would use an ML model or complex heuristic using the input data.
  
  let baseRisk = 20;

  // Simple heuristic Demo
  if (metrics) {
      if (metrics.heartRate > 90) baseRisk += 10;
      if (metrics.stressLevel > 70) baseRisk += 15;
      if (metrics.sleepHours < 6) baseRisk += 10;
  }

  // Add some randomness for the "Alive" feeling in demo
  const variability = Math.floor(Math.random() * 10) - 5; 
  const totalRisk = Math.min(Math.max(baseRisk + variability, 1), 99);

  let riskCategory = "Low";
  if (totalRisk > 30) riskCategory = "Moderate";
  if (totalRisk > 70) riskCategory = "High";

  // Factors contributing (Explainable AI mock)
  const factors = [];
  if (metrics?.stressLevel > 70) factors.push("High Stress Levels");
  if (metrics?.sleepHours < 6) factors.push("Insufficient Sleep");
  if (metrics?.heartRate > 90) factors.push("Elevated Heart Rate");

  res.json({
    score: totalRisk,
    category: riskCategory,
    factors: factors,
    timestamp: new Date()
  });
};

module.exports = { analyzeRisk };
