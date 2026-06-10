/**
 * @module hooks/useInsights
 */
import React, { useState, useEffect, useCallback } from 'react';

import { generateWeeklyInsights } from '../services/geminiService';
import { generateDeterministicTips, trackError } from '../utils';
import { useActivities } from './useActivities';
import { InsightMessage } from '../types';
import { useAsync } from './useAsync';
import { INSIGHT_GENERATION_COOLDOWN_MS } from '../constants';

/**
 * Hook to manage the retrieval and generation of carbon footprint insights.
 * Combines deterministic rule-based tips with AI-generated insights based on recent activities.
 * Enforces a cooldown period to prevent excessive API calls.
 *
 * @returns Object containing insights array, loading/error states, activity counts, and generation handlers.
 */
export const useInsights = (): {
  insights: InsightMessage[];
  loading: boolean;
  error: string;
  activitiesCount: number;
  fetchInsights: () => Promise<void>;
  handleRegenerate: () => void;
  lastGenTime: number;
} => {
  const { activities } = useActivities();
  const [insights, setInsights] = useState<InsightMessage[]>([]);
  const [lastGenTime, setLastGenTime] = useState(0);

  const {
    execute: fetchInsights,
    loading,
    error,
  } = useAsync(
    useCallback(async (): Promise<void> => {
      const deterministicTips = generateDeterministicTips(activities);
      const aiInsights = await generateWeeklyInsights(activities);

      setInsights([...deterministicTips, ...aiInsights]);
      setLastGenTime(Date.now());
    }, [activities]),
  );

  const hasFetchedRef = React.useRef(false);

  useEffect(() => {
    if (activities.length > 0 && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchInsights().catch((err: unknown) => {
        hasFetchedRef.current = false; // allow retry on failure
        trackError(err as Error);
      });
    }
  }, [activities.length, fetchInsights]);

  const handleRegenerate = (): void => {
    if (Date.now() - lastGenTime < INSIGHT_GENERATION_COOLDOWN_MS) return;
    fetchInsights().catch((err: unknown) => {
      trackError(err as Error);
    });
  };

  return {
    insights,
    loading: loading || false,
    error: error ? 'Failed to load insights. Please try again later.' : '',
    activitiesCount: activities.length,
    fetchInsights,
    handleRegenerate,
    lastGenTime,
  };
};
