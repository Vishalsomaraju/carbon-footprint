/**
 * @module pages/CommutePage
 */

import React, { useState } from 'react';

import { useCommute } from '../hooks';
import { Card } from '../components/ui';
import { CommuteForm, CommuteSummary } from '../components/features';

export const CommutePage: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState<string>('driving');
  
  const { route, loading, error, success, calculateRoute, logCommute } = useCommute();

  const handleCalculate = (e: React.FormEvent, actOrigin: string, actDest: string): void => {
    e.preventDefault();
    calculateRoute(actOrigin, actDest, mode).catch(() => {});
  };

  const handleLogCommute = (): void => {
    logCommute(mode).catch(() => {});
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Commute Calculator</h1>
        <p className="text-gray-600 mt-1">Calculate your commute emissions and log them directly.</p>
      </div>

      <Card className="p-6">
        <CommuteForm
          origin={origin} setOrigin={setOrigin}
          destination={destination} setDestination={setDestination}
          mode={mode} setMode={setMode} loading={loading} onCalculate={handleCalculate}
        />

        {error && <div className="mt-6 bg-red-50 text-red-700 px-4 py-3 rounded-md">{error}</div>}
        {success && <div className="mt-6 bg-green-50 text-green-700 px-4 py-3 rounded-md">Commute logged!</div>}
        {route && !success && <CommuteSummary route={route} loading={loading} onLogCommute={handleLogCommute} />}
      </Card>
    </div>
  );
};
