/**
 * @module hooks/useActivities
 */

import { useState, useEffect, useCallback } from 'react';

import { ActivityRecord } from '../types';
import { activityService } from '../services';
import { useAuthContext } from '../contexts/AuthContext';
import { calculateCo2 } from '../utils/co2Calculator';
import { trackError } from '../utils/errorTracker';
import { activitySchema, ActivityFormData } from '../utils/validation';

export interface UseActivitiesReturn {
  activities: ActivityRecord[];
  loading: boolean;
  error: Error | null;
  addActivity: (data: ActivityFormData) => Promise<string>;
  refresh: () => Promise<void>;
}

export const useActivities = (): UseActivitiesReturn => {
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
    } catch (err: unknown) {
      trackError(err, 'fetchActivities');
      setError(err as Error);
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

  const addActivity = useCallback(
    async (activityData: ActivityFormData): Promise<string> => {
      if (!user) throw new Error('User not authenticated');

      const parsedData = activitySchema.parse(activityData);

      let carbonImpact = parsedData.value * 0.2; // Fallback
      const { category, subCategory, value } = parsedData;

      if (category && subCategory) {
        carbonImpact = calculateCo2(category, subCategory, value);
        if (carbonImpact === 0) carbonImpact = parsedData.value * 0.2; // Fallback if no matching factor
      }

      const newActivity: Omit<ActivityRecord, 'id'> = {
        ...parsedData,
        carbonImpact,
        userId: user.uid,
      };

      try {
        const id = await activityService.logActivity(newActivity);
        const activityWithId: ActivityRecord = { ...newActivity, id };
        setActivities((prev) => [activityWithId, ...prev]);
        return id;
      } catch (err: unknown) {
        trackError(err, 'addActivity');
        setError(err as Error);
        throw err;
      }
    },
    [user],
  );

  return {
    activities,
    loading,
    error,
    addActivity,
    refresh: fetchActivities,
  };
};
