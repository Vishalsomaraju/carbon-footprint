/**
 * @module pages/CommutePage
 * @description Commute emissions calculator using Maps API.
 */
import React from 'react';

import { Toast } from '../components/ui/Toast';
import { CommuteForm } from '../components/commute/CommuteForm';
import { CommuteResults } from '../components/commute/CommuteResults';
import { useCommute } from '../hooks';

export const CommutePage: React.FC = (): React.ReactElement => {
  const {
    origin, setOrigin, destination, setDestination, mode, setMode, days, setDays,
    loading, result, error, toast, setToast, logLoading, handleCalculate, handleLog
  } = useCommute();

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Commute Calculator</h1>
        <p className="text-gray-600 mt-1">Estimate your daily and annual commute emissions.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <CommuteForm 
          origin={origin} setOrigin={setOrigin}
          destination={destination} setDestination={setDestination}
          mode={mode} setMode={setMode}
          days={days} setDays={setDays}
          loading={loading} error={error} onCalculate={handleCalculate}
        />
        {result && (
          <CommuteResults 
            result={result} mode={mode} days={days} 
            logLoading={logLoading} onLog={handleLog} 
          />
        )}
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
};
