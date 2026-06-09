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
      <div className="bg-charcoal-core p-4 rounded-2xl border border-whisper-border text-center">
        <p className="font-label-sm text-label-sm text-muted-steel">Activities</p>
        <p className="font-headline-md text-headline-md text-on-surface mt-1">{activities.length}</p>
      </div>
      <div className="bg-charcoal-core p-4 rounded-2xl border border-whisper-border text-center">
        <p className="font-label-sm text-label-sm text-muted-steel">Total CO2</p>
        <p className="font-headline-md text-headline-md text-on-surface mt-1">
          {totalCo2.toFixed(1)} <span className="text-sm text-muted-steel">kg</span>
        </p>
      </div>
      <div className="bg-charcoal-core p-4 rounded-2xl border border-whisper-border text-center">
        <p className="font-label-sm text-label-sm text-muted-steel">Streak</p>
        <p className="font-headline-md text-headline-md text-alert-amber mt-1 flex items-center justify-center gap-1">
          {streak}
          <span className="material-symbols-outlined text-alert-amber" style={{ fontSize: '20px' }}>local_fire_department</span>
        </p>
      </div>
    </div>
  );
};
