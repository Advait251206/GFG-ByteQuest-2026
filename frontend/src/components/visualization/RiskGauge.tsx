import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';

interface RiskGaugeProps {
  score: number; // 0-100
}

export const RiskGauge = ({ score }: RiskGaugeProps) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 30) return "#10b981"; // Green
    if (s < 70) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  const color = getColor(score);

  return (
    <Card className="flex flex-col items-center justify-center relative overflow-hidden">
      <h3 className="text-xl font-bold mb-6 z-10">Overall Risk Score</h3>
      
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="#374151"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              className="text-5xl font-bold text-white"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {score}%
            </motion.span>
            <span className="text-sm text-gray-400 mt-1">Probability</span>
        </div>
      </div>
      
      {/* Background Glow */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-transparent to-transparent opacity-20 pointer-events-none" 
        style={{ background: `radial-gradient(circle at center, ${color}22 0%, transparent 70%)` }}
      />
    </Card>
  );
};
