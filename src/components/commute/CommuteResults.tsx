/**
 * @module components/commute/CommuteResults
 */
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { EMISSION_FACTORS } from '../../constants';
import { CommuteResult } from '../../services/mapsService';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface CommuteResultsProps {
  result: CommuteResult;
  mode: keyof typeof EMISSION_FACTORS.transport;
  days: number;
  logLoading: boolean;
  onLog: () => void;
}

export const CommuteResults: React.FC<CommuteResultsProps> = ({
  result,
  mode,
  days,
  logLoading,
  onLog,
}): import('react').ReactElement => {
  const chartData = Object.entries(EMISSION_FACTORS.transport)
    .map(([key, factor]) => {
      return {
        name: key.replace('_per_km', '').replace('_', ' '),
        value: factor * result.distanceKm * 2 * days * 52, // Annual kg
        rawKey: key,
      };
    })
    .sort((a, b) => b.value - a.value);

  const bestAlternative = chartData.find((d) => d.value < result.annualCo2Kg);
  const savings = bestAlternative ? result.annualCo2Kg - bestAlternative.value : 0;

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-charcoal-core p-6 rounded-2xl border border-whisper-border shadow-sm">
          <p className="font-label-sm text-label-sm text-muted-steel mb-1">Daily Co2</p>
          <p className="font-headline-lg text-headline-lg text-on-surface">
            {result.dailyCo2Kg.toFixed(1)}{' '}
            <span className="font-body-md text-body-md text-muted-steel">kg</span>
          </p>
          <p className="font-body-md text-body-md text-muted-steel mt-2">
            {result.distanceKm.toFixed(1)} km &bull; {result.durationMinutes} mins
          </p>
        </div>
        <div className="bg-charcoal-core p-6 rounded-2xl border border-whisper-border shadow-sm">
          <p className="font-label-sm text-label-sm text-muted-steel mb-1">
            Annual Co2
          </p>
          <p className="font-headline-lg text-headline-lg text-on-surface">
            {result.annualCo2Kg.toFixed(0)}{' '}
            <span className="font-body-md text-body-md text-muted-steel">kg</span>
          </p>
          <p className="font-body-md text-body-md text-muted-steel mt-2">
            Requires ~{(result.annualCo2Kg / 21).toFixed(0)} trees to offset
          </p>
        </div>
      </div>

      {bestAlternative && savings > 10 && (
        <div className="bg-charcoal-core p-6 rounded-2xl border border-bio-emerald/30">
          <p className="text-on-surface flex items-start gap-2">
            <span className="material-symbols-outlined text-bio-emerald shrink-0 mt-0.5" style={{ fontSize: '18px' }}>lightbulb</span>
            <span>
              <span className="font-bold text-bio-emerald">Tip: </span>If you switched to{' '}
              <strong>{bestAlternative.name}</strong>, you&apos;d save{' '}
              <strong>{savings.toFixed(0)} kg</strong> of CO2 per year!
            </span>
          </p>
        </div>
      )}

      <div className="bg-charcoal-core p-6 rounded-2xl border border-whisper-border shadow-sm h-80 flex flex-col">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Annual Emissions by Mode</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8', fontFamily: 'JetBrains Mono' }}
                width={90}
              />
              <Tooltip
                cursor={{ fill: '#1E293B' }}
                contentStyle={{
                  backgroundColor: '#2e3447',
                  border: '1px solid #4edea3',
                  borderRadius: '4px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px',
                  color: '#4edea3'
                }}
                formatter={(val: number) => [val.toFixed(0) + ' kg', 'Annual CO2']}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.rawKey === mode ? '#10b981' : '#2e3447'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onLog}
          disabled={logLoading}
          className="px-6 py-3 bg-bio-emerald text-deep-void rounded-lg font-label-sm text-label-sm font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
        >
          {logLoading ? <LoadingSpinner size="sm" /> : null} Log This Commute
        </button>
      </div>
    </div>
  );
};
