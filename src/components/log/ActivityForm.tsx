/**
 * @module components/log/ActivityForm
 * @description Step 2: Subtype and value input.
 */

import React, { useState } from 'react';

interface Props {
  readonly category: string;
  readonly onNext: (data: { subCategory: string; value: number }) => void;
  readonly onBack: () => void;
}

const OPTIONS: Record<string, string[]> = {
  transport: ['car_petrol', 'car_diesel', 'car_electric', 'bus', 'train', 'flight_domestic'],
  food: ['beef', 'chicken', 'vegetarian', 'vegan'],
  energy: ['electricity', 'natural_gas'],
  shopping: ['clothing', 'electronics'],
};

export const ActivityForm: React.FC<Props> = ({ category, onNext, onBack }): React.ReactElement => {
  const [subCategory, setSubCategory] = useState<string>('');
  const [value, setValue] = useState<number | ''>('');
  const [error, setError] = useState<string>('');

  const opts = OPTIONS[category] || [];

  const handleNext = (): void => {
    if (!subCategory) return setError('Please select a subtype.');
    if (!value || value <= 0) return setError('Value must be greater than 0.');
    onNext({ subCategory, value: Number(value) });
  };

  return (
    <div className="bg-charcoal-core p-6 rounded-2xl shadow-sm border border-whisper-border space-y-6">
      <div>
        <label htmlFor="subCategory" className="block font-label-sm text-label-sm text-muted-steel mb-1">
          Activity Type
        </label>
        <select
          id="subCategory"
          value={subCategory}
          onChange={(e) => {
            setSubCategory(e.target.value);
            setError('');
          }}
          className="w-full p-3 bg-surface-container-high border border-whisper-border rounded-lg focus:ring-2 focus:ring-bio-emerald outline-none text-on-surface font-body-md"
        >
          <option value="">Select type...</option>
          {opts.map((opt) => (
            <option key={opt} value={opt}>
              {opt.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="value" className="block font-label-sm text-label-sm text-muted-steel mb-1">
          Value (km, meals, kWh)
        </label>
        <input
          id="value"
          type="number"
          min="0.1"
          step="0.1"
          value={value}
          onChange={(e) => {
            setValue(e.target.value ? Number(e.target.value) : '');
            setError('');
          }}
          className="w-full p-3 bg-surface-container-high border border-whisper-border rounded-lg focus:ring-2 focus:ring-bio-emerald outline-none text-on-surface font-body-md"
        />
      </div>
      {error && (
        <div role="alert" className="text-critical-crimson text-sm">
          {error}
        </div>
      )}
      <div className="flex justify-end gap-3 pt-4 border-t border-whisper-border">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-muted-steel hover:bg-surface-variant rounded-lg font-label-sm text-label-sm font-bold"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2 bg-bio-emerald text-deep-void rounded-lg hover:opacity-90 font-label-sm text-label-sm font-bold"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
