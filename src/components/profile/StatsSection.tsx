/**
 * @module components/profile/StatsSection
 */
import React from 'react';

import { useActivities } from '../../hooks';

export const StatsSection: React.FC = (): React.ReactElement => {
  const { activities } = useActivities();
  const totalCo2 = activities.reduce((sum, a) => sum + a.carbonImpact, 0);

  let streak = 0;
  const days = new Set(
    activities.map((a) => new Date(a.date || new Date().toISOString()).toISOString().split('T')[0]),
  ).size;
  if (days > 0) streak = days; // Simplified streak calculation for display

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
        <p className="text-sm text-gray-500 font-medium">Activities</p>
        <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
      </div>
      <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
        <p className="text-sm text-gray-500 font-medium">Total CO2</p>
        <p className="text-2xl font-bold text-gray-900">
          {totalCo2.toFixed(1)} <span className="text-sm">kg</span>
        </p>
      </div>
      <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
        <p className="text-sm text-gray-500 font-medium">Streak</p>
        <p className="text-2xl font-bold text-orange-500">{streak} 🔥</p>
      </div>
    </div>
  );
};
