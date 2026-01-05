const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  metrics: {
    heartRate: { type: Number }, // BPM
    bloodPressure: { type: String }, // e.g., "120/80"
    stressLevel: { type: Number, min: 0, max: 100 }, // 0-100
    sleepHours: { type: Number },
    steps: { type: Number },
  },
  labResults: {
    cholesterol: { type: Number },
    glucose: { type: Number },
    // Expand as needed
  },
  riskScore: { type: Number } // Calculated by AI
});

module.exports = mongoose.model('HealthData', healthDataSchema);
