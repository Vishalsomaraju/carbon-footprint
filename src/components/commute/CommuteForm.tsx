/**
 * @module components/commute/CommuteForm
 */
import React from 'react';

import { EMISSION_FACTORS } from '../../constants';

interface CommuteFormProps {
  origin: string;
  setOrigin: (v: string) => void;
  destination: string;
  setDestination: (v: string) => void;
  mode: keyof typeof EMISSION_FACTORS.transport;
  setMode: (v: keyof typeof EMISSION_FACTORS.transport) => void;
  days: number;
  setDays: (v: number) => void;
  loading: boolean;
  error: string;
  onCalculate: () => void;
}

export const CommuteForm: React.FC<CommuteFormProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  mode,
  setMode,
  days,
  setDays,
  loading,
  error,
  onCalculate,
}): import('react').ReactElement => (
  <div className="lg:col-span-1 bg-charcoal-core p-6 rounded-2xl border border-whisper-border shadow-sm space-y-4 h-fit">
    <div>
      <label htmlFor="origin" className="block font-label-sm text-label-sm text-muted-steel mb-1">
        Origin (Home)
      </label>
      <input
        id="origin"
        value={origin}
        onChange={(e): void => setOrigin(e.target.value)}
        className="w-full p-2.5 bg-surface-container-high border border-whisper-border rounded-lg outline-none focus:ring-2 focus:ring-bio-emerald text-on-surface placeholder-muted-steel font-body-md"
        placeholder="e.g. 123 Main St"
      />
    </div>
    <div>
      <label htmlFor="dest" className="block font-label-sm text-label-sm text-muted-steel mb-1">
        Destination (Work)
      </label>
      <input
        id="dest"
        value={destination}
        onChange={(e): void => setDestination(e.target.value)}
        className="w-full p-2.5 bg-surface-container-high border border-whisper-border rounded-lg outline-none focus:ring-2 focus:ring-bio-emerald text-on-surface placeholder-muted-steel font-body-md"
        placeholder="e.g. 456 Office Blvd"
      />
    </div>
    <div>
      <label htmlFor="mode" className="block font-label-sm text-label-sm text-muted-steel mb-1">
        Transport Mode
      </label>
      <select
        id="mode"
        value={mode}
        onChange={(e): void => setMode(e.target.value as keyof typeof EMISSION_FACTORS.transport)}
        className="w-full p-2.5 bg-surface-container-high border border-whisper-border rounded-lg outline-none focus:ring-2 focus:ring-bio-emerald text-on-surface font-body-md"
      >
        {Object.keys(EMISSION_FACTORS.transport).map((k) => (
          <option key={k} value={k}>
            {k.replace('_per_km', '').replace('_', ' ').toUpperCase()}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="days" className="block font-label-sm text-label-sm text-muted-steel mb-1">
        Work Days / Week
      </label>
      <input
        id="days"
        type="number"
        min="1"
        max="7"
        value={days}
        onChange={(e): void => setDays(Number(e.target.value))}
        className="w-full p-2.5 bg-surface-container-high border border-whisper-border rounded-lg outline-none focus:ring-2 focus:ring-bio-emerald text-on-surface font-body-md"
      />
    </div>

    {error && (
      <div role="alert" className="text-critical-crimson text-sm mt-2">
        {error}
      </div>
    )}

    <button
      onClick={onCalculate}
      disabled={loading}
      className="w-full py-3 mt-4 bg-bio-emerald text-deep-void rounded-lg font-label-sm text-label-sm font-bold hover:opacity-90 disabled:opacity-50"
    >
      {loading ? 'Calculating...' : 'Calculate'}
    </button>
  </div>
);
