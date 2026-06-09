/**
 * @module components/log/CategorySelector
 * @description Step 1: Select category.
 */

import React from 'react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../../constants';

interface Props {
  readonly onSelect: (cat: string) => void;
}

export const CategorySelector: React.FC<Props> = ({ onSelect }): React.ReactElement => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className="p-6 bg-white border-2 border-gray-100 rounded-xl hover:border-carbon-500 transition-colors flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] }}>
            {cat.charAt(0).toUpperCase()}
          </div>
          <span className="text-lg font-bold text-gray-900">{label}</span>
        </button>
      ))}
    </div>
  );
};
