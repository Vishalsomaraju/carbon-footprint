/**
 * @module components/dashboard/DailySummaryCard
 * @description Shows today's total CO2 vs target with status badge.
 */

import React from 'react';
import { formatCo2, getFootprintLevel } from '../../utils/co2';
import { TARGET_KG_PER_DAY } from '../../constants';

interface Props {
  readonly totalKg: number;
}

export const DailySummaryCard: React.FC<Props> = ({ totalKg }): React.ReactElement => {
  const level = getFootprintLevel(totalKg);
  
  const badgeColors = {
    excellent: 'bg-green-100 text-green-800 border-green-200',
    good: 'bg-blue-100 text-blue-800 border-blue-200',
    average: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    poor: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Today's Footprint</h2>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-gray-900">{formatCo2(totalKg)}</span>
          <span className="text-gray-400 mb-1">/ {formatCo2(TARGET_KG_PER_DAY)} target</span>
        </div>
      </div>
      <div className={`px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-wide ${badgeColors[level]}`}>
        {level}
      </div>
    </div>
  );
};
