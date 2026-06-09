/**
 * @module components/dashboard/StreakBadge
 * @description Shows a streak if logged consecutively.
 */

import React, { useMemo } from 'react';
import { ActivityRecord } from '../../types';

interface Props {
  readonly activities: ActivityRecord[];
}

export const StreakBadge: React.FC<Props> = ({ activities }): React.ReactElement | null => {
  const streak = useMemo(() => {
    if (!activities.length) return 0;
    // Simple mock logic for demonstration
    const uniqueDays = new Set(activities.map(a => a.date.split('T')[0]));
    return uniqueDays.size;
  }, [activities]);

  if (streak < 2) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-bold shadow-sm border border-orange-200">
      <span>🔥</span> {streak} day streak
    </div>
  );
};
