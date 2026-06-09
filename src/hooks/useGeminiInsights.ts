/**
 * @module hooks/useGeminiInsights
 */

import { useState } from 'react';

import { InsightMessage, ActivityRecord } from '../types';
import { geminiService } from '../services';

export interface UseGeminiInsightsReturn {
  insights: InsightMessage[];
  loading: boolean;
  error: Error | null;
  generateInsights: (activities: ActivityRecord[]) => Promise<InsightMessage[]>;
}

export const useGeminiInsights = (): UseGeminiInsightsReturn => {
  const [insights, setInsights] = useState<InsightMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateInsights = async (activities: ActivityRecord[]): Promise<InsightMessage[]> => {
    setLoading(true);
    setError(null);
    try {
      const recentActivities = activities.slice(0, 10);
      const newInsights = await geminiService.generateWeeklyInsights(recentActivities);
      setInsights(newInsights);
      return newInsights;
    } catch (err: unknown) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    insights,
    loading,
    error,
    generateInsights
  };
};
