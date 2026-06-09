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
  <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4 h-fit">
    <div>
      <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
        Origin (Home)
      </label>
      <input
        id="origin"
        value={origin}
        onChange={(e): void => setOrigin(e.target.value)}
        className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-carbon-500"
        placeholder="e.g. 123 Main St"
      />
    </div>
    <div>
      <label htmlFor="dest" className="block text-sm font-medium text-gray-700 mb-1">
        Destination (Work)
      </label>
      <input
        id="dest"
        value={destination}
        onChange={(e): void => setDestination(e.target.value)}
        className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-carbon-500"
        placeholder="e.g. 456 Office Blvd"
      />
    </div>
    <div>
      <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
        Transport Mode
      </label>
      <select
        id="mode"
        value={mode}
        onChange={(e): void => setMode(e.target.value as keyof typeof EMISSION_FACTORS.transport)}
        className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-carbon-500"
      >
        {Object.keys(EMISSION_FACTORS.transport).map((k) => (
          <option key={k} value={k}>
            {k.replace('_per_km', '').replace('_', ' ').toUpperCase()}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">
        Work Days / Week
      </label>
      <input
        id="days"
        type="number"
        min="1"
        max="7"
        value={days}
        onChange={(e): void => setDays(Number(e.target.value))}
        className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-carbon-500"
      />
    </div>

    {error && (
      <div role="alert" className="text-red-600 text-sm mt-2">
        {error}
      </div>
    )}

    <button
      onClick={onCalculate}
      disabled={loading}
      className="w-full py-3 mt-4 bg-carbon-600 text-white rounded-lg font-medium hover:bg-carbon-700 disabled:opacity-50"
    >
      {loading ? 'Calculating...' : 'Calculate'}
    </button>
  </div>
);
