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
    origin,
    destination,
    mode,
    days,
    loading,
    result,
    error,
    toast,
    setToast,
    logLoading,
    handleCalculate,
    handleLog,
  } = useCommute();

  return (
    <div className="flex-1 overflow-y-auto p-gutter-md lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <div className="bg-charcoal-core p-6 rounded-2xl border border-whisper-border shadow-sm">
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
            Commute Calculator
          </h1>
          <p className="font-body-md text-body-md text-muted-steel mt-1">
            Estimate your daily and annual commute emissions.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CommuteForm
            defaultValues={{ origin, destination, mode, days }}
            loading={loading}
            error={error}
            onCalculate={handleCalculate}
          />
          {result && (
            <CommuteResults
              result={result}
              mode={mode}
              days={days}
              logLoading={logLoading}
              onLog={handleLog}
            />
          )}
        </div>
        {toast && <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
      </div>
    </div>
  );
};
