/**
 * @module hooks/useActivities
 */

import { useState, useEffect, useCallback } from 'react';

import { ActivityRecord } from '../types';
import { activityService } from '../services';
import { useAuthContext } from '../contexts/AuthContext';
import { calculateCo2, activitySchema, ActivityFormData, trackError } from '../utils';
import { useAsync } from './useAsync';

export interface UseActivitiesReturn {
  activities: ActivityRecord[];
  loading: boolean;
  error: Error | null;
  addActivity: (data: ActivityFormData) => Promise<string>;
  refresh: () => Promise<void>;
}

/**
 * Hook to manage user activities.
 * Provides functions to add new activities and refresh the activity list from the database.
 * Requires the user to be authenticated.
 *
 * @returns {UseActivitiesReturn} Object containing activities, loading state, error state, and mutator functions.
 */
export const useActivities = (): UseActivitiesReturn => {
  const { user } = useAuthContext();
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const {
    execute: fetchActivities,
    loading: fetchLoading,
    error: fetchError,
    data: fetchedActivities,
  } = useAsync(
    useCallback(async (): Promise<ActivityRecord[]> => {
      if (!user) return [];
      return activityService.getUserActivities(user.uid);
    }, [user])
  );

  useEffect(() => {
    if (user) {
      fetchActivities().catch((err: unknown) => {
        trackError(err as Error);
      });
    } else {
      setActivities([]);
    }
  }, [user, fetchActivities]);

  useEffect(() => {
    if (fetchedActivities) {
      setActivities(fetchedActivities);
    }
  }, [fetchedActivities]);

  const {
    execute: addActivity,
    loading: addLoading,
    error: addError,
  } = useAsync(
    useCallback(async (activityData: ActivityFormData): Promise<string> => {
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

      const id = await activityService.logActivity(newActivity);
      const activityWithId: ActivityRecord = { ...newActivity, id };
      setActivities((prev) => [activityWithId, ...prev]);
      return id;
    }, [user])
  );

  return {
    activities,
    loading: fetchLoading || addLoading,
    error: fetchError || addError,
    addActivity,
    refresh: async (): Promise<void> => { await fetchActivities(); },
  };
};
