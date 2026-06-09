/**
 * @module pages/LogActivityPage
 * @description Page dedicated to logging new carbon footprint activities
 */

import React from 'react';

import { ActivityForm } from '../components/features/ActivityForm';
import { useActivities } from '../hooks';

export const LogActivityPage: React.FC = (): import('react').ReactElement => {
  const { addActivity } = useActivities();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Log Activity</h1>
        <p className="mt-2 text-slate-600">
          Record your transport, food, energy, or shopping activities to calculate their carbon impact.
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <ActivityForm onSubmit={addActivity} />
      </div>
    </div>
  );
};
