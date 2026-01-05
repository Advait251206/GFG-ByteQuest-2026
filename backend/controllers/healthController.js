const HealthData = require('../models/HealthData');
const User = require('../models/User');

// @desc    Get user health data
// @route   GET /api/health
// @access  Private
const getHealthData = async (req, res) => {
  try {
    const healthData = await HealthData.findOne({ userId: req.user._id });
    
    if (healthData) {
      res.json(healthData);
    } else {
      res.status(404).json({ message: 'No health data found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update or Create user metrics
// @route   POST /api/health/metrics
// @access  Private
const updateMetrics = async (req, res) => {
  const { 
    age, 
    gender, 
    heartRate, 
    bloodPressure, 
    sleepHours, 
    stressLevel, 
    steps,
    cholesterol,
    glucose
  } = req.body;

  try {
    // 1. Update User Profile if provided
    if (age || gender) {
        const user = await User.findById(req.user._id);
        if (user) {
            user.age = age || user.age;
            user.gender = gender || user.gender;
            await user.save();
        }
    }

    // 2. Update/Create Health Data
    let healthData = await HealthData.findOne({ userId: req.user._id });

    if (!healthData) {
        healthData = new HealthData({ 
            userId: req.user._id,
            metrics: {},
            labResults: {}
        });
    }

    // Update fields
    if (heartRate) healthData.metrics.heartRate = heartRate;
    if (bloodPressure) healthData.metrics.bloodPressure = bloodPressure;
    if (sleepHours) healthData.metrics.sleepHours = sleepHours;
    if (stressLevel) healthData.metrics.stressLevel = stressLevel;
    if (steps) healthData.metrics.steps = steps;
    
    if (cholesterol) healthData.labResults.cholesterol = cholesterol;
    if (glucose) healthData.labResults.glucose = glucose;

    // Trigger Risk Calculation
    try {
        const { analyzeRisk } = require('../services/groqService');
        // Combine profile and metrics for analysis
        const analysisData = {
           age: user?.age || age,
           gender: user?.gender || gender,
           ...healthData.metrics
        };
        
        console.log("Analyzing risk for:", analysisData);
        const riskScore = await analyzeRisk(analysisData);
        healthData.riskScore = riskScore;
        
    } catch (err) {
        console.error("Failed to update risk score:", err);
    }

    await healthData.save();
    res.json(healthData);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHealthData, updateMetrics };
