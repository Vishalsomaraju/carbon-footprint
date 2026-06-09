/**
 * @module hooks/useGeminiInsights
 */

import { useState } from 'react';

import { InsightMessage, ActivityRecord } from '../types';
import { geminiService } from '../services';

export const useGeminiInsights = () => {
  const [insights, setInsights] = useState<InsightMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateInsights = async (activities: ActivityRecord[]) => {
    setLoading(true);
    setError(null);
    try {
      const recentActivities = activities.slice(0, 10);
      const newInsights = await geminiService.generateWeeklyInsights(recentActivities);
      setInsights(newInsights);
      return newInsights;
    } catch (err: any) {
      setError(err);
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
