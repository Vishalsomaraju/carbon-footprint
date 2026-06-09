/**
 * @module components/dashboard/CategoryBreakdown
 * @description 4 cards showing today's totals per category.
 */

import React, { useMemo } from 'react';

import { ActivityRecord } from '../../types';
import { formatCo2 } from '../../utils/co2';

interface Props {
  readonly activities: ActivityRecord[];
}

export const CategoryBreakdown: React.FC<Props> = ({ activities }): React.ReactElement => {
  const totals = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const res: Record<string, number> = { transport: 0, food: 0, energy: 0, shopping: 0 };
    activities
      .filter((a) => a.date.startsWith(today))
      .forEach((a) => {
        if (res[a.category] !== undefined && a.carbonImpact) res[a.category] += a.carbonImpact;
      });
    return res;
  }, [activities]);

  const maxTotal = Math.max(...Object.values(totals), 1); // Avoid div by 0

  const catData: Record<string, { label: string; icon: string; colorClass: string }> = {
    transport: { label: 'Transport Matrix', icon: 'electric_car', colorClass: 'alert-amber' },
    energy: { label: 'Grid Consumption', icon: 'bolt', colorClass: 'primary' },
    food: { label: 'Dietary Impact', icon: 'restaurant', colorClass: 'secondary' },
    shopping: { label: 'Consumer Goods', icon: 'shopping_bag', colorClass: 'critical-crimson' },
  };

  return (
    <div className="bg-charcoal-core border border-whisper-border rounded-2xl p-6 relative h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline-md text-headline-md text-on-surface">Stream Analysis</h3>
        <button className="text-primary hover:text-primary-fixed transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>
      <div className="space-y-6">
        {Object.entries(totals).map(([cat, total]) => {
          const info = catData[cat] || catData.shopping;
          const percentage = Math.min((total / maxTotal) * 100, 100);
          return (
            <div key={cat} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-whisper-border flex items-center justify-center shrink-0">
                <span className={`material-symbols-outlined text-${info.colorClass}`}>{info.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-label-sm text-label-sm text-on-surface">{info.label}</span>
                  <span className={`font-mono-metrics text-mono-metrics text-${info.colorClass}`}>
                    {formatCo2(total)}
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`bg-${info.colorClass} h-full rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
