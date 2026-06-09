/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module features/FootprintChart
 */

import React, { useMemo, memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import { Card } from '../ui';
import { ActivityRecord } from '../../types';

interface FootprintChartProps {
  activities: ActivityRecord[];
}

export const FootprintChart: React.FC<FootprintChartProps> = memo(({ activities }): React.ReactElement => {
  const data = useMemo(() => {
    // Group by date
    const grouped = activities.reduce((acc: any, curr) => {
      const date = curr.date.split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, transport: 0, home_energy: 0, food: 0, shopping: 0 };
      }
      
      // Calculate footprint (simplified mock calculation for visualization)
      let footprint = curr.value;
      if (curr.category === 'transport') footprint *= 0.2; // 0.2 kg CO2 per km
      else if (curr.category === 'home_energy') footprint *= 0.5; // 0.5 kg CO2 per kWh
      else if (curr.category === 'food') footprint *= 2.0; // 2.0 kg CO2 per meal
      else if (curr.category === 'shopping') footprint *= 1.5; // 1.5 kg CO2 per item
      
      acc[date][curr.category as keyof typeof acc[string]] += footprint;
      return acc;
    }, {} as any);

    return (Object.values(grouped) as any[]).sort((a: {date: string}, b: {date: string}) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7); // last 7 days
  }, [activities]);

  if (!activities.length) {
    return (
      <Card className="w-full h-64 flex items-center justify-center p-6 text-gray-500">
        No data available yet. Log your first activity!
      </Card>
    );
  }

  return (
    <Card className="w-full p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Carbon Footprint Trend (Last 7 Days)</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="date" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{ fill: '#F3F4F6' }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="transport" name="Transport" stackId="a" fill="#3B82F6" radius={[0, 0, 4, 4]} />
            <Bar dataKey="home_energy" name="Home Energy" stackId="a" fill="#F59E0B" />
            <Bar dataKey="food" name="Food" stackId="a" fill="#10B981" />
            <Bar dataKey="shopping" name="Shopping" stackId="a" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});
