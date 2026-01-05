import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Activity, Heart, Moon, Zap, User } from 'lucide-react';

interface MetricsModalProps {
  onComplete: () => void;
}

export const MetricsModal = ({ onComplete }: MetricsModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    heartRate: '',
    bloodPressure: '',
    sleepHours: '',
    stressLevel: 5
  });

  const handleChange = (e: any) => {
    let value = e.target.value;
    // Prevent negative numbers for numeric fields
    if (['age', 'heartRate', 'sleepHours', 'stressLevel'].includes(e.target.name)) {
        if (value < 0) value = 0;
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/health/metrics', formData, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      onComplete();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg bg-surface border-white/10 relative overflow-hidden">
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Activity size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold">Setup Your Profile</h2>
                    <p className="text-gray-400 text-sm">Help us personalize your health analysis</p>
                 </div>
            </div>

            <div className="space-y-4">
                {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Age</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-gray-500" size={16} />
                                    <input type="number" name="age" min="0" value={formData.age} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Years" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                         <div>
                            <label className="block text-sm text-gray-400 mb-1">Heart Rate (BPM)</label>
                            <div className="relative">
                                <Heart className="absolute left-3 top-3 text-gray-500" size={16} />
                                <input type="number" name="heartRate" value={formData.heartRate} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. 72" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                         <div>
                            <label className="block text-sm text-gray-400 mb-1">Blood Pressure</label>
                            <div className="relative">
                                <Activity className="absolute left-3 top-3 text-gray-500" size={16} />
                                <input type="text" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. 120/80" />
                            </div>
                        </div>
                        
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Sleep (Hours)</label>
                                <div className="relative">
                                    <Moon className="absolute left-3 top-3 text-gray-500" size={16} />
                                    <input type="number" name="sleepHours" value={formData.sleepHours} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. 7" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Stress (1-10)</label>
                                <div className="relative">
                                    <Zap className="absolute left-3 top-3 text-gray-500" size={16} />
                                    <input type="number" name="stressLevel" max="10" min="1" value={formData.stressLevel} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. 5" />
                                </div>
                            </div>
                         </div>
                    </motion.div>
                )}
            </div>

            <div className="flex justify-between mt-8">
                {step > 1 ? (
                    <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
                ) : <div></div>}
                
                {step < 2 ? (
                     <Button onClick={() => setStep(step + 1)}>Next</Button>
                ) : (
                    <Button onClick={handleSubmit} isLoading={loading}>Complete Setup</Button>
                )}
            </div>
        </div>
      </Card>
    </div>
  );
};
