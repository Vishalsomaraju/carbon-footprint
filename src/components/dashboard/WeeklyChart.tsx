/**
 * @module components/dashboard/WeeklyChart
 * @description Recharts BarChart showing last 7 days CO2.
 */

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import { TARGET_KG_PER_DAY } from '../../constants';
import { ActivityRecord } from '../../types';
import { getFootprintLevel } from '../../utils/co2';

interface Props {
  readonly activities: ActivityRecord[];
}

export const WeeklyChart: React.FC<Props> = ({ activities }): React.ReactElement => {
  const data = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      return { date: format(d, 'yyyy-MM-dd'), label: format(d, 'EEE'), total: 0 };
    });

    activities.forEach(act => {
      const day = last7Days.find(d => d.date === act.date.split('T')[0]);
      if (day && act.carbonImpact) day.total += act.carbonImpact;
    });

    return last7Days;
  }, [activities]);

  const getColor = (val: number) => {
    const level = getFootprintLevel(val);
    if (level === 'excellent') return '#22c55e';
    if (level === 'good') return '#3b82f6';
    if (level === 'average') return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Last 7 Days</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <ReferenceLine y={TARGET_KG_PER_DAY} stroke="#9ca3af" strokeDasharray="4 4" label={{ position: 'top', value: 'Target', fill: '#9ca3af', fontSize: 12 }} />
          <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.total)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
