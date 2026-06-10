/**
 * @module hooks/useCommute
 */
import { useState, useCallback } from 'react';

import { calculateCommuteEmissions, CommuteResult } from '../services/mapsService';
import { EMISSION_FACTORS } from '../constants';
import { useActivities } from './useActivities';
import { CommuteFormData, ActivityFormData } from '../utils';
import { useAsync } from './useAsync';

/**
 * Hook to manage the state and actions for calculating and logging commute emissions.
 * Handles the interaction with the Distance Matrix API and the Activity database.
 *
 * @returns Object containing loading states, calculation results, error messages, toast state, and handler functions.
 */
export const useCommute = (): {
  loading: boolean;
  result: CommuteResult | null;
  error: string;
  toast: { msg: string; type: 'success' | 'error' } | null;
  setToast: (v: { msg: string; type: 'success' | 'error' } | null) => void;
  logLoading: boolean;
  handleCalculate: (data: CommuteFormData) => Promise<CommuteResult | void>;
  handleLog: (params: {
    result: CommuteResult;
    mode: keyof typeof EMISSION_FACTORS.transport;
    origin: string;
    destination: string;
  }) => Promise<void>;
} => {
  const { addActivity } = useActivities();
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const {
    execute: calculate,
    loading: calcLoading,
    error: calcError,
    data: result,
  } = useAsync(
    useCallback(async (data: CommuteFormData): Promise<CommuteResult> => {
      return calculateCommuteEmissions({
        origin: data.origin,
        destination: data.destination,
        transportMode: data.mode as keyof typeof EMISSION_FACTORS.transport,
        workDaysPerWeek: data.days,
      });
    }, [])
  );

  const handleCalculate = async (data: CommuteFormData): Promise<CommuteResult | void> => {
    try {
      return await calculate(data);
    } catch (_err) {
      // Error is handled by useAsync state
    }
  };

  const { execute: logCommute, loading: logLoading } = useAsync(
    useCallback(
      async (params: {
        result: CommuteResult;
        mode: keyof typeof EMISSION_FACTORS.transport;
        origin: string;
        destination: string;
      }): Promise<void> => {
        const { result, mode, origin, destination } = params;
        await addActivity({
          category: 'transport',
          subCategory: mode,
          value: result.distanceKm * 2, // round trip
          description: `Commute: ${origin} to ${destination}`,
          date: new Date().toISOString(),
        } as ActivityFormData);
        setToast({ msg: 'Commute logged successfully!', type: 'success' });
      },
      [addActivity]
    )
  );

  const handleLog = async (params: {
    result: CommuteResult;
    mode: keyof typeof EMISSION_FACTORS.transport;
    origin: string;
    destination: string;
  }): Promise<void> => {
    try {
      await logCommute(params);
    } catch (_err) {
      setToast({ msg: 'Failed to log commute.', type: 'error' });
    }
  };

  return {
    loading: calcLoading,
    result: result || null,
    error: calcError ? 'Could not calculate commute. Please check the locations.' : '',
    toast,
    setToast,
    logLoading,
    handleCalculate,
    handleLog,
  };
};
