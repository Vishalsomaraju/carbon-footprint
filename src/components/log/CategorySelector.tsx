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
          className="p-6 bg-charcoal-core border border-whisper-border rounded-2xl hover:border-bio-emerald transition-colors flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md"
        >
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-deep-void font-bold"
            style={{ backgroundColor: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] }}
          >
            {cat.charAt(0).toUpperCase()}
          </div>
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{label}</span>
        </button>
      ))}
    </div>
  );
};
