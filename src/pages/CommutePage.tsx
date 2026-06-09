/**
 * @module pages/CommutePage
 * @description Commute emissions calculator using Maps API.
 */
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { calculateCommuteEmissions, CommuteResult } from '../services/mapsService';
import { EMISSION_FACTORS } from '../constants';
import { useActivities } from '../hooks';
import { trackError } from '../utils/errorTracker';
import { Toast } from '../components/ui/Toast';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const CommutePage: React.FC = (): React.ReactElement => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState<keyof typeof EMISSION_FACTORS.transport>('car_petrol_per_km');
  const [days, setDays] = useState(5);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CommuteResult | null>(null);
  const [error, setError] = useState('');
  
  const { addActivity } = useActivities();
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  const [logLoading, setLogLoading] = useState(false);

  const handleCalculate = async (): Promise<void> => {
    if (!origin || !destination) return setError('Please enter origin and destination');
    try {
      setLoading(true);
      setError('');
      const res = await calculateCommuteEmissions(origin, destination, mode, days);
      setResult(res);
    } catch (err) {
      setError('Could not calculate commute. Please check the locations.');
      trackError(err, 'handleCalculate');
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async (): Promise<void> => {
    if (!result) return;
    try {
      setLogLoading(true);
      await addActivity({
        category: 'transport',
        subCategory: mode,
        value: result.distanceKm * 2, // round trip
        description: `Commute: ${origin} to ${destination}`,
        date: new Date().toISOString()
      });
      setToast({ msg: 'Commute logged successfully!', type: 'success' });
    } catch (err) {
      setToast({ msg: 'Failed to log commute.', type: 'error' });
      trackError(err, 'handleLog');
    } finally {
      setLogLoading(false);
    }
  };

  // Generate comparison chart data
  const chartData = result ? Object.entries(EMISSION_FACTORS.transport).map(([key, factor]) => {
    return {
      name: key.replace('_per_km', '').replace('_', ' '),
      value: factor * result.distanceKm * 2 * days * 52, // Annual kg
      rawKey: key
    };
  }).sort((a, b) => b.value - a.value) : [];

  const bestAlternative = chartData.find(d => d.value < (result?.annualCo2Kg || 0));
  const savings = bestAlternative ? (result!.annualCo2Kg - bestAlternative.value) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Commute Calculator</h1>
        <p className="text-gray-600 mt-1">Estimate your daily and annual commute emissions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4 h-fit">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">Origin (Home)</label>
            <input id="origin" value={origin} onChange={e => setOrigin(e.target.value)} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-carbon-500" placeholder="e.g. 123 Main St" />
          </div>
          <div>
            <label htmlFor="dest" className="block text-sm font-medium text-gray-700 mb-1">Destination (Work)</label>
            <input id="dest" value={destination} onChange={e => setDestination(e.target.value)} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-carbon-500" placeholder="e.g. 456 Office Blvd" />
          </div>
          <div>
            <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">Transport Mode</label>
            <select id="mode" value={mode} onChange={e => setMode(e.target.value as unknown)} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-carbon-500">
              {Object.keys(EMISSION_FACTORS.transport).map(k => (
                <option key={k} value={k}>{k.replace('_per_km', '').replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">Work Days / Week</label>
            <input id="days" type="number" min="1" max="7" value={days} onChange={e => setDays(Number(e.target.value))} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-carbon-500" />
          </div>
          
          {error && <div role="alert" className="text-red-600 text-sm mt-2">{error}</div>}
          
          <button onClick={handleCalculate} disabled={loading} className="w-full py-3 mt-4 bg-carbon-600 text-white rounded-lg font-medium hover:bg-carbon-700 disabled:opacity-50">
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </div>

        {result && (
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
              <button onClick={handleLog} disabled={logLoading} className="px-6 py-3 bg-carbon-600 text-white rounded-lg font-medium hover:bg-carbon-700 disabled:opacity-50 flex items-center gap-2">
                {logLoading ? <LoadingSpinner size="sm" /> : null} Log This Commute
              </button>
            </div>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
};
