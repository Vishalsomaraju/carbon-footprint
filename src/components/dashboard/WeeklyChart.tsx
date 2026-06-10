/**
 * @module components/dashboard/WeeklyChart
 * @description Recharts BarChart showing last 7 days CO2.
 */

import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays } from 'date-fns';

import { TARGET_KG_PER_DAY } from '../../constants';
import { ActivityRecord } from '../../types';

interface Props {
  readonly activities: ActivityRecord[];
}

export const WeeklyChart: React.FC<Props> = ({ activities }): React.ReactElement => {
  const data = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      return { date: format(d, 'yyyy-MM-dd'), label: format(d, 'EEE'), total: 0 };
    });

    activities.forEach((act) => {
      const day = last7Days.find((d) => d.date === act.date.split('T')[0]);
      if (day && act.carbonImpact) day.total += act.carbonImpact;
    });

    return last7Days;
  }, [activities]);

  return (
    <div className="bg-charcoal-core border border-whisper-border rounded-2xl p-6 min-h-[320px] flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface">7-Day Trajectory</h3>
          <p className="font-mono-metrics text-mono-metrics text-muted-steel mt-1">
            Variance analysis & trend forecasting
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-surface-variant text-on-surface px-3 py-1 rounded-md font-label-sm text-label-sm border border-whisper-border">
            Week
          </span>
          <span className="text-muted-steel px-3 py-1 font-label-sm text-label-sm hover:text-on-surface cursor-pointer">
            Month
          </span>
        </div>
      </div>

      <div className="flex-1 relative chart-grid rounded-lg border border-whisper-border overflow-hidden mt-4" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            />
            <Tooltip
              cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '4 4' }}
              contentStyle={{
                backgroundColor: '#2e3447',
                border: '1px solid #4edea3',
                borderRadius: '4px',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                color: '#4edea3',
              }}
              itemStyle={{ color: '#4edea3' }}
              formatter={(value: number) => [`${value.toFixed(1)} kg`, 'CO2e']}
            />
            <ReferenceLine y={TARGET_KG_PER_DAY} stroke="#F59E0B" strokeDasharray="4 4" />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#areaGradient)"
              activeDot={{ r: 4, fill: '#020617', stroke: '#10B981', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Accessible data table for screen readers */}
      <div className="sr-only">
        <table aria-label="7-Day Trajectory Data">
          <thead>
            <tr>
              <th>Date</th>
              <th>CO2e (kg)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.date}>
                <td>{row.date} ({row.label})</td>
                <td>{row.total.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
