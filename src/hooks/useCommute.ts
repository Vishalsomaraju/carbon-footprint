/**
 * @module hooks/useCommute
 */

import { useState } from 'react';

import { useActivities } from './useActivities';
import { mapsService } from '../services';
import { CommuteRoute } from '../types';
import { trackError, trackEvent } from '../services/analyticsService';

export interface UseCommuteReturn {
  route: CommuteRoute | null;
  loading: boolean;
  error: string;
  success: boolean;
  calculateRoute: (origin: string, destination: string, mode: string) => Promise<void>;
  logCommute: (mode: string) => Promise<void>;
}

export const useCommute = (): UseCommuteReturn => {
  const { addActivity } = useActivities();
  const [route, setRoute] = useState<CommuteRoute | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const calculateRoute = async (origin: string, destination: string, mode: string): Promise<void> => {
    if (!origin || !destination) {
      setError('Please enter both origin and destination.');
      return;
    }
    
    setLoading(true);
    setError('');
    setRoute(null);
    setSuccess(false);

    try {
      const calcRoute = await mapsService.calculateRoute(origin, destination, mode);
      setRoute(calcRoute);
      trackEvent('calculate_commute', { mode });
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Failed to calculate route.');
      trackError(errorObj);
    } finally {
      setLoading(false);
    }
  };

  const logCommute = async (mode: string): Promise<void> => {
    if (!route) return;
    setLoading(true);
    try {
      await addActivity({
          category: "transport",
        category: 'transport',
        subCategory: mode === 'driving' ? 'car_petrol_per_km' : mode === 'transit' ? 'bus_per_km' : 'walking_per_km',
        value: route.distanceKm,
        description: `Commute: ${route.origin} to ${route.destination} via ${route.transportMode}`,
        date: new Date().toISOString().split('T')[0]
      });
      setSuccess(true);
      trackEvent('log_commute_success', { mode });
    } catch (err) {
      trackError(err as Error);
      setError('Failed to log commute. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { route, loading, error, success, calculateRoute, logCommute };
};
