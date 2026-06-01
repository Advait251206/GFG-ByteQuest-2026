import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, TrendingUp, AlertTriangle, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const RiskPrediction = () => {
    const { user } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/analytics/forecast/${user?._id}`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                });
                setData(res.data);
            } catch (err) {
                console.error("Forecast error", err);
            } finally {
                setLoading(false);
            }
        };
        if (user?._id) fetchData();
    }, [user]);

    if (loading) return <div className="text-white p-8">Loading AI Forecast...</div>;

    // Combine history and forecast for chart
    const chartData = [
        ...(data?.history?.map((h: any) => ({ name: new Date(h.date).toLocaleDateString(), risk: h.risk, type: 'History' })) || []),
        ...(data?.forecast?.map((f: any) => ({ name: f.day, risk: f.risk, type: 'Forecast' })) || [])
    ];

    const riskVelocity = data?.riskVelocity || 0;
    const isWorsening = riskVelocity > 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-primary/20 rounded-xl text-primary">
                    <TrendingUp size={32} />
                 </div>
                 <div>
                    <h1 className="text-3xl font-bold">Future Risk Forecast</h1>
                    <p className="text-gray-400">AI-driven prediction of your health trajectory for the next 7 days.</p>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Risk Velocity Gauge */}
                <Card className="p-6 md:col-span-1 border-primary/20 bg-black/40">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <Activity size={20} className="text-primary"/> Risk Velocity
                    </h3>
                    <div className="flex flex-col items-center justify-center h-[200px]">
                         <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-5xl font-bold ${isWorsening ? 'text-red-500' : 'text-green-500'}`}
                         >
                            {riskVelocity > 0 ? '+' : ''}{riskVelocity.toFixed(1)}%
                         </motion.div>
                         <p className="text-gray-400 mt-2 text-center">
                            Risk change per week
                         </p>
                         <div className={`mt-4 px-3 py-1 rounded-full text-sm ${isWorsening ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                            {isWorsening ? 'Deteriorating Trend' : 'Improving Trend'}
                         </div>
                    </div>
                </Card>
                
                {/* AI Recommendations */}
                <Card className="p-6 md:col-span-2 border-white/10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <PlayCircle size={20} className="text-blue-400"/> AI Recommendations
                    </h3>
                    <div className="space-y-4">
                        {isWorsening ? (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3">
                                <AlertTriangle className="text-red-500 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-red-400">Warning: Upward Risk Trend</h4>
                                    <p className="text-sm text-gray-300">Your vitals indicate a steady increase in physiological stress. Immediate lifestyle intervention is recommended.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex gap-3">
                                <Activity className="text-green-500 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-green-400">Positive Trajectory</h4>
                                    <p className="text-sm text-gray-300">Your health metrics are stabilizing. Keep up your current sleep and exercise routine.</p>
                                </div>
                            </div>
                        )}
                        <p className="text-gray-400 text-sm italic">
                            "Based on a linear regression model of your last 30 days of heart rate and sleep data."
                        </p>
                    </div>
                </Card>
            </div>

            {/* Forecast Chart */}
            <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">30-Day Trajectory Analysis</h3>
                <div style={{ width: '100%', height: 300, minHeight: 300 }}>
                {chartData.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                        <ReferenceLine x="Day +1" stroke="white" strokeDasharray="3 3" label="Forecast Start" />
                        <Area 
                            type="monotone" 
                            dataKey="risk" 
                            stroke="#10b981" 
                            fill="url(#colorRisk)" 
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
                )}
                </div>
            </Card>
        </div>
    );
};
