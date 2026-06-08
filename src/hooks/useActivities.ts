/**
 * @module hooks/useActivities
 */

import { useState, useEffect, useCallback } from 'react';

import { ActivityRecord } from '../types';
import { activityService } from '../services';
import { useAuthContext } from '../store/AuthContext';
import { EMISSION_FACTORS } from '../constants';
import { trackError } from '../utils/errorTracker';

export const useActivities = () => {
  const { user } = useAuthContext();
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActivities = useCallback(async (): Promise<void> => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await activityService.getUserActivities(user.uid);
      setActivities(data);
    } catch (err: any) {
      trackError(err, 'fetchActivities');
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchActivities();
    } else {
      setActivities([]);
      setLoading(false);
    }
  }, [user, fetchActivities]);

  const addActivity = useCallback(async (activityData: { category: string; subCategory?: string; value: number; description?: string; date: string }): Promise<string> => {
    if (!user) throw new Error("User not authenticated");
    let carbonImpact = activityData.value * 0.2; // Fallback
    const { category, subCategory, value } = activityData;
    if (category && subCategory && category in EMISSION_FACTORS) {
      const factors = EMISSION_FACTORS[category as keyof typeof EMISSION_FACTORS];
      if (subCategory in factors) carbonImpact = value * (factors[subCategory as keyof typeof factors] as number);
    }
    const newActivity: Omit<ActivityRecord, 'id'> = { ...activityData, carbonImpact, userId: user.uid };
    
    try {
      const id = await activityService.logActivity(newActivity);
      const activityWithId: ActivityRecord = { ...newActivity, id };
      setActivities(prev => [activityWithId, ...prev]);
      return id;
    } catch (err: any) {
      trackError(err, 'addActivity');
      setError(err);
      throw err;
    }
  }, [user]);

  return {
    activities,
    loading,
    error,
    addActivity,
    refresh: fetchActivities
  };
};
