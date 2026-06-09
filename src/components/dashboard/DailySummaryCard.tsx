/**
 * @module components/dashboard/DailySummaryCard
 * @description Shows today&apos;s total CO2 vs target with status badge.
 */

import React from 'react';

import { formatCo2 } from '../../utils/co2';
import { TARGET_KG_PER_DAY } from '../../constants';

interface Props {
  readonly totalKg: number;
}

export const DailySummaryCard: React.FC<Props> = ({ totalKg }): React.ReactElement => {
  const percentage = Math.min((totalKg / TARGET_KG_PER_DAY) * 100, 100);

  return (
    <div className="bg-charcoal-core border border-whisper-border rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-outline-variant transition-colors duration-300 h-full">
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-bio-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-headline-lg text-headline-lg text-on-surface">Daily Emission</h3>
          <span className="material-symbols-outlined text-muted-steel">today</span>
        </div>
        <p className="font-body-md text-body-md text-muted-steel mb-8">Current atmospheric load</p>
      </div>
      <div className="mt-auto">
        <div className="flex items-end gap-2 mb-2">
          <span className="font-display-lg text-display-lg text-bio-emerald">{formatCo2(totalKg).replace(' kg', '')}</span>
          <span className="font-mono-metrics text-mono-metrics text-muted-steel mb-2">kg CO2e</span>
        </div>
        {/* Mini Progress/Goal Bar */}
        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-4">
          <div 
            className="bg-bio-emerald h-full rounded-full relative transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer"></div>
          </div>
        </div>
        <div className="flex justify-between mt-2 font-mono-metrics text-[10px] text-muted-steel">
          <span>0</span>
          <span>Target: {formatCo2(TARGET_KG_PER_DAY)}</span>
        </div>
      </div>
    </div>
  );
};
