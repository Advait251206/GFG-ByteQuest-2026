import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AlertTriangle, CheckCircle, Activity, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const Analysis = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [riskScore, setRiskScore] = useState<number>(0);
  const [analysisText, setAnalysisText] = useState<string>('');
  
  useEffect(() => {
    if (user?.token) {
        fetchAnalysis();
    }
  }, [user?.token]);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
        // 1. Get Metrics
        const { data: healthData } = await axios.get('http://localhost:5000/api/health', {
            headers: { Authorization: `Bearer ${user?.token}` }
        });
        setMetrics(healthData.metrics);
        setRiskScore(healthData.riskScore || 0);

        // 2. Get Chat History (Overview of symptoms)
        let chatContext = "";
        try {
            const { data: history } = await axios.get(`http://localhost:5000/api/chat/history?userId=${user?._id}`);
            // Extract last 3 user messages to find symptoms
            const lastUserMsgs = history.filter((m: any) => m.role === 'user').slice(-3).map((m: any) => m.content).join(". ");
            if (lastUserMsgs) chatContext = `Recent Chat Symptoms: ${lastUserMsgs}`;
        } catch (e) {
            console.warn("Could not fetch chat history for analysis context");
        }

        // 3. Request Detailed Explanation from AI
        // We reuse the Chat Endpoint for this specialized one-off request
        const explanationRes = await axios.post('http://localhost:5000/api/chat/message', {
            message: `Analyze my specific health metrics: ${JSON.stringify(healthData.metrics)}. ${chatContext}. My calculated Risk Score is ${healthData.riskScore}. Provide a concise, bullet-point analysis of these results. Focus only on the most important risks and actionable advice. Do not provide long explanations.`,
            context: [], 
            userId: user?._id,
            saveToHistory: false // Don't save this analysis prompt to chat history
        });
        
        setAnalysisText(explanationRes.data.reply);

    } catch (err) {
        console.error("Analysis failed", err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold">Detailed Risk Analysis</h2>
         <Button onClick={fetchAnalysis} isLoading={loading} variant="outline">Refresh Analysis</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <Card className="flex flex-col items-center justify-center p-8 border-l-4 border-l-primary">
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="60" stroke="#374151" strokeWidth="8" fill="transparent" />
                    <motion.circle 
                        cx="64" cy="64" r="60" 
                        stroke={riskScore > 50 ? '#ef4444' : '#10b981'} 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 60}
                        initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - riskScore / 100) }}
                        transition={{ duration: 1.5 }}
                        strokeLinecap="round"
                    />
                 </svg>
                 <span className="absolute text-3xl font-bold">{riskScore}%</span>
            </div>
            <p className="text-gray-400 font-medium">Probabilistic Risk</p>
        </Card>

        {/* AI Insight Card */}
        <Card className="md:col-span-2 p-6 bg-gradient-to-br from-surface to-primary/5">
            <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/20 text-primary">
                    <Brain size={24} />
                </div>
                <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold text-white">AI Medical Assessment</h3>
                    {loading ? (
                        <div className="space-y-2 animate-pulse">
                            <div className="h-4 bg-white/10 rounded w-3/4"></div>
                            <div className="h-4 bg-white/10 rounded w-1/2"></div>
                            <div className="h-4 bg-white/10 rounded w-full"></div>
                        </div>
                    ) : (
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {analysisText || "Loading detailed analysis..."}
                        </p>
                    )}
                </div>
            </div>
        </Card>
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4">Key Risk Factors</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {/* Dynamic Factors based on metrics */}
         {metrics?.heartRate > 90 && (
             <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                 <AlertTriangle className="text-red-500" />
                 <div>
                     <p className="font-bold text-red-500">Elevated Heart Rate</p>
                     <p className="text-sm text-gray-400">Resting HR of {metrics.heartRate} is above average.</p>
                 </div>
             </div>
         )}
         {metrics?.sleepHours < 6 && (
             <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3">
                 <Activity className="text-orange-500" />
                 <div>
                     <p className="font-bold text-orange-500">Poor Sleep Quality</p>
                     <p className="text-sm text-gray-400">Getting less than 6 hours increases cardiovascular risk.</p>
                 </div>
             </div>
         )}
         {metrics?.stressLevel > 7 && (
             <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-3">
                 <Zap className="text-yellow-500" />
                 <div>
                     <p className="font-bold text-yellow-500">High Stress Load</p>
                     <p className="text-sm text-gray-400">Chronic stress is a major silent contributor.</p>
                 </div>
             </div>
         )}
         {(!metrics?.heartRate || metrics.heartRate <= 90) && metrics?.sleepHours >= 6 && metrics?.stressLevel <= 7 && (
             <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 col-span-2">
                 <CheckCircle className="text-green-500" />
                 <div>
                     <p className="font-bold text-green-500">No Immediate Red Flags</p>
                     <p className="text-sm text-gray-400">Verified metrics appear within normal ranges.</p>
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};
