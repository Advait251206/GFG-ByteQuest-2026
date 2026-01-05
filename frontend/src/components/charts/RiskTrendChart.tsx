import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Card } from '../ui/Card';

interface RiskData {
  name: string;
  risk: number;
}

interface RiskTrendChartProps {
    data?: RiskData[];
}

const defaultData = [
  { name: 'Mon', risk: 20 },
  { name: 'Tue', risk: 35 },
  { name: 'Wed', risk: 25 },
  { name: 'Thu', risk: 45 },
  { name: 'Fri', risk: 30 },
  { name: 'Sat', risk: 55 },
  { name: 'Sun', risk: 40 },
];

export const RiskTrendChart = ({ data = defaultData }: RiskTrendChartProps) => {
  return (
    <Card className="h-[400px]">
      <h3 className="text-xl font-bold mb-4">Risk Trend Analysis</h3>
      <div className="h-[300px] w-full" style={{ minHeight: '300px', minWidth: '100%' }}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af" 
              tick={{ fill: '#9ca3af' }} 
              axisLine={{ stroke: '#374151' }} 
            />
            <YAxis 
               stroke="#9ca3af" 
               tick={{ fill: '#9ca3af' }}
               axisLine={{ stroke: '#374151' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} 
            />
            <Area 
              type="monotone" 
              dataKey="risk" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRisk)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
