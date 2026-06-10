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
    const uniqueDays = new Set(activities.map((a) => a.date.split('T')[0]));
    const today = new Date().toISOString().split('T')[0];
    const cursor = new Date();
    // If today has no log yet, allow the streak to carry over from yesterday
    // so users don't see their streak reset every morning before their first log.
    if (!uniqueDays.has(today)) {
      cursor.setDate(cursor.getDate() - 1);
    }
    let count = 0;
    while (true) {
      const dateStr = cursor.toISOString().split('T')[0];
      if (!uniqueDays.has(dateStr)) break;
      count++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [activities]);

  if (streak < 2) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-charcoal-core text-alert-amber px-4 py-2 rounded-full font-bold shadow-sm border border-whisper-border">
      <span className="material-symbols-outlined text-alert-amber text-sm">
        local_fire_department
      </span>{' '}
      {streak} day streak
    </div>
  );
};
