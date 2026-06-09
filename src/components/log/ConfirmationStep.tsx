/**
 * @module components/log/ConfirmationStep
 * @description Step 3: Confirm and save.
 */

import React, { useState } from 'react';

import { formatCo2 } from '../../utils/co2';
import { EMISSION_FACTORS } from '../../constants';

interface Props {
  readonly data: { category: string; subCategory: string; value: number };
  readonly onSubmit: (notes: string) => Promise<void>;
  readonly onBack: () => void;
  readonly isLoading: boolean;
}

export const ConfirmationStep: React.FC<Props> = ({ data, onSubmit, onBack, isLoading }): React.ReactElement => {
  const [notes, setNotes] = useState('');
  
  // Calculate mock value based on constants
  let factor = 0;
  try {
    const cats = EMISSION_FACTORS as any;
    const key = Object.keys(cats[data.category]).find(k => k.startsWith(data.subCategory));
    if (key) factor = cats[data.category][key];
  } catch(e) { /* ignored */ }
  const estimatedCo2 = (factor * data.value) || (data.value * 0.5);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
      <div className="text-center p-6 bg-carbon-50 rounded-xl border border-carbon-100">
        <p className="text-sm text-carbon-600 uppercase tracking-wider font-bold mb-2">Estimated Impact</p>
        <p className="text-4xl font-bold text-carbon-900">{formatCo2(estimatedCo2)}</p>
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Optional Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-carbon-500 outline-none"
          placeholder="E.g. Rode my bike to work today!"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onClick={onBack} disabled={isLoading} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50">Back</button>
        <button 
          type="button" 
          onClick={() => onSubmit(notes)} 
          disabled={isLoading}
          className="px-6 py-2 bg-carbon-600 text-white rounded-lg hover:bg-carbon-700 font-medium disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Activity'}
        </button>
      </div>
    </div>
  );
};
