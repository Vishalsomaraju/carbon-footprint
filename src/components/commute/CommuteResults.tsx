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

export const CommuteResults: React.FC<CommuteResultsProps> = ({ result, mode, days, logLoading, onLog }): import('react').ReactElement => {
  const chartData = Object.entries(EMISSION_FACTORS.transport).map(([key, factor]) => {
    return {
      name: key.replace('_per_km', '').replace('_', ' '),
      value: factor * result.distanceKm * 2 * days * 52, // Annual kg
      rawKey: key
    };
  }).sort((a, b) => b.value - a.value);

  const bestAlternative = chartData.find(d => d.value < result.annualCo2Kg);
  const savings = bestAlternative ? (result.annualCo2Kg - bestAlternative.value) : 0;

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm uppercase tracking-wider font-bold mb-1">Daily Co2</p>
          <p className="text-3xl font-bold text-gray-900">{result.dailyCo2Kg.toFixed(1)} <span className="text-lg font-normal text-gray-500">kg</span></p>
          <p className="text-sm text-gray-500 mt-2">{result.distanceKm.toFixed(1)} km &bull; {result.durationMinutes} mins</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm uppercase tracking-wider font-bold mb-1">Annual Co2</p>
          <p className="text-3xl font-bold text-gray-900">{result.annualCo2Kg.toFixed(0)} <span className="text-lg font-normal text-gray-500">kg</span></p>
          <p className="text-sm text-gray-500 mt-2">Requires ~{(result.annualCo2Kg / 21).toFixed(0)} trees to offset</p>
        </div>
      </div>

      {bestAlternative && savings > 10 && (
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <p className="text-green-800">
            <span className="font-bold">💡 Tip:</span> If you switched to <strong>{bestAlternative.name}</strong>, you&apos;d save <strong>{savings.toFixed(0)} kg</strong> of CO2 per year!
          </p>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Annual Emissions by Mode</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} width={90} />
              <Tooltip cursor={{ fill: '#f9fafb' }} formatter={(val: number) => [val.toFixed(0) + ' kg', 'Annual CO2']} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.rawKey === mode ? '#10b981' : '#e5e7eb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={onLog} disabled={logLoading} className="px-6 py-3 bg-carbon-600 text-white rounded-lg font-medium hover:bg-carbon-700 disabled:opacity-50 flex items-center gap-2">
          {logLoading ? <LoadingSpinner size="sm" /> : null} Log This Commute
        </button>
      </div>
    </div>
  );
};
