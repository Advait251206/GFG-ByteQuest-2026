import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { RiskGauge } from '../components/visualization/RiskGauge';
import { RiskTrendChart } from '../components/charts/RiskTrendChart';
import { MetricsModal } from '../components/onboarding/MetricsModal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Heart, Moon, Zap, ShieldCheck, Activity } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const fetchMetrics = async () => {
    try {
        const { data } = await axios.get('http://localhost:5000/api/health', {
            headers: { Authorization: `Bearer ${user?.token}` }
        });
        setMetrics(data.metrics);
        // If essential metrics are missing, show onboarding even if some record exists
        if (!data.metrics?.heartRate) {
            setShowOnboarding(true);
        }
    } catch (error) {
        // If 404, it means no data exists yet
        setShowOnboarding(true);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
        fetchMetrics();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <Activity size={48} className="text-white" />
        </div>
        <div className="space-y-4 max-w-lg">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Silent Disease
          </h1>
          <p className="text-gray-400 text-lg">
            Early detection engine powered by AI. Monitor your health risks, analyze trends, and get personalized insights.
          </p>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="primary" size="lg" className="px-8">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" size="lg" className="px-8">
              Create Account
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12 text-left">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <ShieldCheck className="text-primary mb-3" size={24} />
                <h3 className="font-semibold text-white mb-1">Risk Analysis</h3>
                <p className="text-sm text-gray-400">Real-time probabilistic risk assessment for silent conditions.</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <Activity className="text-secondary mb-3" size={24} />
                <h3 className="font-semibold text-white mb-1">Health Trends</h3>
                <p className="text-sm text-gray-400">Visualize vital signs and detect anomalies early.</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <Zap className="text-accent mb-3" size={24} />
                <h3 className="font-semibold text-white mb-1">AI Insights</h3>
                <p className="text-sm text-gray-400">Get personalized health advice from our AI engine.</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold">Health Dashboard</h2>
            <p className="text-gray-400">Welcome back, {user.name}</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm border border-green-500/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                System Normal
            </span>
        </div>
      </div>

      {showOnboarding && <MetricsModal onComplete={() => { setShowOnboarding(false); fetchMetrics(); }} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mocking risk score for now based on metrics, real logic would be backend */}
        <RiskGauge score={metrics ? Math.round((metrics.heartRate / 200) * 80) : 0} />
        <div className="md:col-span-2">
           <RiskTrendChart />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hasHoverEffect className="flex flex-col items-start">
            <div className="p-3 rounded-full bg-red-500/10 text-red-500 mb-4">
                <Heart size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-400">Heart Rate</h3>
            <div className="text-3xl font-bold mt-1">
                {metrics?.heartRate || '--'} <span className="text-sm font-normal text-gray-500">BPM</span>
            </div>
            <p className="text-sm text-green-500 mt-2">Latest reading</p>
        </Card>

        <Card hasHoverEffect className="flex flex-col items-start">
            <div className="p-3 rounded-full bg-purple-500/10 text-purple-500 mb-4">
                <Moon size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-400">Sleep Quality</h3>
            <div className="text-3xl font-bold mt-1">{metrics?.sleepHours || '--'}h</div>
             <p className="text-sm text-green-500 mt-2">Last night</p>
        </Card>

        <Card hasHoverEffect className="flex flex-col items-start">
            <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-500 mb-4">
                <Zap size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-400">Stress Level</h3>
            <div className="text-3xl font-bold mt-1">{metrics?.stressLevel || '--'}/10</div>
             <p className="text-sm text-gray-500 mt-2">Self-reported</p>
        </Card>
      </div>
    </div>
  );
};
