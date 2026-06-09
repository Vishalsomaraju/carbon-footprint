/**
 * @module hooks/useCommute
 */
import { useState } from 'react';

import { calculateCommuteEmissions, CommuteResult } from '../services/mapsService';
import { EMISSION_FACTORS } from '../constants';
import { useActivities } from './useActivities';
import { trackError } from '../utils/errorTracker';

export const useCommute = (): {
  origin: string;
  setOrigin: (v: string) => void;
  destination: string;
  setDestination: (v: string) => void;
  mode: keyof typeof EMISSION_FACTORS.transport;
  setMode: (v: keyof typeof EMISSION_FACTORS.transport) => void;
  days: number;
  setDays: (v: number) => void;
  loading: boolean;
  result: CommuteResult | null;
  error: string;
  toast: { msg: string; type: 'success' | 'error' } | null;
  setToast: (v: { msg: string; type: 'success' | 'error' } | null) => void;
  logLoading: boolean;
  handleCalculate: () => Promise<void>;
  handleLog: () => Promise<void>;
} => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState<keyof typeof EMISSION_FACTORS.transport>('car_petrol_per_km');
  const [days, setDays] = useState(5);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CommuteResult | null>(null);
  const [error, setError] = useState('');

  const { addActivity } = useActivities();
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [logLoading, setLogLoading] = useState(false);

  const handleCalculate = async (): Promise<void> => {
    if (!origin || !destination) {
      setError('Please enter origin and destination');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await calculateCommuteEmissions(origin, destination, mode, days);
      setResult(res);
    } catch (err) {
      setError('Could not calculate commute. Please check the locations.');
      trackError(err, 'handleCalculate');
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async (): Promise<void> => {
    if (!result) return;
    try {
      setLogLoading(true);
      await addActivity({
        category: 'transport',
        subCategory: mode,
        value: result.distanceKm * 2, // round trip
        description: `Commute: ${origin} to ${destination}`,
        date: new Date().toISOString(),
      });
      setToast({ msg: 'Commute logged successfully!', type: 'success' });
    } catch (err) {
      setToast({ msg: 'Failed to log commute.', type: 'error' });
      trackError(err, 'handleLog');
    } finally {
      setLogLoading(false);
    }
  };

  return {
    origin,
    setOrigin,
    destination,
    setDestination,
    mode,
    setMode,
    days,
    setDays,
    loading,
    result,
    error,
    toast,
    setToast,
    logLoading,
    handleCalculate,
    handleLog,
  };
};
