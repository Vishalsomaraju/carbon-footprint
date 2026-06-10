/**
 * @module components/log/ConfirmationStep
 * @description Step 3: Confirm and save.
 */

import React, { useState } from 'react';

import { formatCo2 } from '../../utils/co2';
import { calculateCo2 } from '../../utils/co2Calculator';

interface Props {
  readonly data: { category: string; subCategory: string; value: number };
  readonly onSubmit: (notes: string) => Promise<void>;
  readonly onBack: () => void;
  readonly isLoading: boolean;
}

export const ConfirmationStep: React.FC<Props> = ({
  data,
  onSubmit,
  onBack,
  isLoading,
}): React.ReactElement => {
  const [notes, setNotes] = useState('');

  // Use the same calculation engine as the save path so preview always matches stored value.
  const estimatedCo2 = data.category && data.subCategory
    ? calculateCo2(data.category, data.subCategory, data.value) || data.value * 0.5
    : data.value * 0.5;

  return (
    <div className="bg-charcoal-core p-6 rounded-2xl shadow-sm border border-whisper-border space-y-6">
      <div className="text-center p-6 bg-surface-container-high rounded-2xl border border-whisper-border">
        <p className="font-label-sm text-label-sm text-muted-steel uppercase tracking-wider font-bold mb-2">
          Estimated Impact
        </p>
        <p className="font-headline-lg text-headline-lg font-bold text-on-surface">
          {formatCo2(estimatedCo2)}
        </p>
      </div>
      <div>
        <label htmlFor="notes" className="block font-label-sm text-label-sm text-muted-steel mb-1">
          Optional Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full p-3 bg-surface-container-high border border-whisper-border rounded-lg focus:ring-2 focus:ring-bio-emerald outline-none text-on-surface placeholder-muted-steel font-body-md"
          placeholder="E.g. Rode my bike to work today!"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-whisper-border">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="px-4 py-2 text-muted-steel hover:bg-surface-variant rounded-lg disabled:opacity-50 font-label-sm text-label-sm font-bold"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onSubmit(notes)}
          disabled={isLoading}
          className="px-6 py-2 bg-bio-emerald text-deep-void rounded-lg hover:opacity-90 disabled:opacity-50 font-label-sm text-label-sm font-bold"
        >
          {isLoading ? 'Saving...' : 'Save Activity'}
        </button>
      </div>
    </div>
  );
};
