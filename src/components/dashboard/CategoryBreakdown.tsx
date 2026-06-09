/**
 * @module components/dashboard/CategoryBreakdown
 * @description 4 cards showing today's totals per category.
 */

import React, { useMemo } from 'react';
import { ActivityRecord } from '../../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../../constants';
import { formatCo2 } from '../../utils/co2';

interface Props {
  readonly activities: ActivityRecord[];
}

export const CategoryBreakdown: React.FC<Props> = ({ activities }): React.ReactElement => {
  const totals = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const res: Record<string, number> = { transport: 0, food: 0, energy: 0, shopping: 0 };
    activities.filter(a => a.date.startsWith(today)).forEach(a => {
      if (res[a.category] !== undefined && a.carbonImpact) res[a.category] += a.carbonImpact;
    });
    return res;
  }, [activities]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(totals).map(([cat, total]) => (
        <div key={cat} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] }} />
            <span className="text-sm font-medium text-gray-600">{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 mt-auto">{formatCo2(total)}</span>
        </div>
      ))}
    </div>
  );
};
