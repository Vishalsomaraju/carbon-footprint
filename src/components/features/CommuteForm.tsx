/**
 * @module components/features/CommuteForm
 */

import React, { useEffect, useRef } from 'react';

import { initGoogleMaps } from '../../services';

interface CommuteFormProps {
  origin: string;
  setOrigin: (o: string) => void;
  destination: string;
  setDestination: (d: string) => void;
  mode: string;
  setMode: (m: string) => void;
  loading: boolean;
  onCalculate: (e: React.FormEvent, actualOrigin: string, actualDest: string) => void;
}

export const CommuteForm: React.FC<CommuteFormProps> = ({
  origin, setOrigin, destination, setDestination, mode, setMode, loading, onCalculate
}) => {
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initGoogleMaps().then((google) => {
      if (originRef.current) new google.maps.places.Autocomplete(originRef.current);
      if (destinationRef.current) new google.maps.places.Autocomplete(destinationRef.current);
    }).catch(err => {
      console.error("Failed to load Google Maps Places API", err);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const actualOrigin = originRef.current?.value || origin;
    const actualDestination = destinationRef.current?.value || destination;
    onCalculate(e, actualOrigin, actualDestination);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origin</label>
          <input
            ref={originRef}
            id="origin"
            type="text"
            placeholder="Starting point"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
          <input
            ref={destinationRef}
            id="destination"
            type="text"
            placeholder="End point"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="block text-sm font-medium text-gray-700">Transport Mode</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['driving', 'transit', 'bicycling', 'walking'].map((m) => (
            <button
              key={m}
              type="button"
              className={`py-2 px-4 rounded-md border text-sm font-medium capitalize transition-colors ${
                mode === m
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setMode(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Calculating...' : 'Calculate Route'}
        </button>
      </div>
    </form>
  );
};
