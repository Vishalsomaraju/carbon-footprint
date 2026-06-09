/**
 * @module components/features/CommuteSummary
 */

import React from 'react';

import { CommuteRoute } from '../../types';

interface CommuteSummaryProps {
  route: CommuteRoute;
  loading: boolean;
  onLogCommute: () => void;
}

export const CommuteSummary: React.FC<CommuteSummaryProps> = ({ route, loading, onLogCommute }) => {
  return (
    <div className="mt-8 pt-8 border-t space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Route Summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <span className="block text-sm text-gray-500 mb-1">Distance</span>
          <span className="block text-2xl font-bold text-gray-900">
            {route.distanceKm.toFixed(1)} km
          </span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <span className="block text-sm text-gray-500 mb-1">Mode</span>
          <span className="block text-2xl font-bold text-gray-900 capitalize">
            {route.transportMode}
          </span>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
          <span className="block text-sm text-green-600 mb-1">Emissions</span>
          <span className="block text-2xl font-bold text-green-700">
            {route.dailyCo2Kg.toFixed(2)} kg
          </span>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={onLogCommute}
          disabled={loading}
          className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          Log This Commute
        </button>
      </div>
    </div>
  );
};
