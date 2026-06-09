/**
 * @module hooks/useInsights
 */
import { useState, useEffect, useCallback } from 'react';

import { generateWeeklyInsights, getReductionChat } from '../services/geminiService';
import { useActivities } from './useActivities';
import { InsightMessage } from '../types';
import { trackError } from '../utils/errorTracker';

export const useInsights = (): {
  insights: InsightMessage[];
  loading: boolean;
  error: string;
  chatMsg: string;
  setChatMsg: (v: string) => void;
  chatResp: string;
  chatLoading: boolean;
  activitiesCount: number;
  fetchInsights: () => Promise<void>;
  handleRegenerate: () => void;
  handleChat: () => Promise<void>;
  lastGenTime: number;
} => {
  const { activities } = useActivities();
  const [insights, setInsights] = useState<InsightMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastGenTime, setLastGenTime] = useState(0);

  const [chatMsg, setChatMsg] = useState('');
  const [chatResp, setChatResp] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const fetchInsights = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const result = await generateWeeklyInsights(activities);
      setInsights(result);
      setLastGenTime(Date.now());
    } catch (err) {
      setError('Failed to load insights. Please try again later.');
      trackError(err, 'fetchInsights UI');
    } finally {
      setLoading(false);
    }
  }, [activities]);

  useEffect(() => {
    if (activities.length > 0 && insights.length === 0) {
      fetchInsights();
    } else if (activities.length === 0) {
      setLoading(false);
    }
  }, [activities.length, insights.length, fetchInsights]);

  const handleRegenerate = (): void => {
    if (Date.now() - lastGenTime < 60000) return;
    fetchInsights();
  };

  const handleChat = async (): Promise<void> => {
    if (!chatMsg.trim()) return;
    try {
      setChatLoading(true);
      setChatResp('');
      const context = `User has ${activities.length} activities logged.`;
      const response = await getReductionChat(chatMsg, context);
      setChatResp(response);
      setChatMsg('');
    } catch (err) {
      setChatResp('Sorry, I encountered an error. Try again.');
      trackError(err, 'handleChat UI');
    } finally {
      setChatLoading(false);
    }
  };

  return {
    insights, loading, error, chatMsg, setChatMsg, chatResp, chatLoading,
    activitiesCount: activities.length, fetchInsights, handleRegenerate, handleChat, lastGenTime
  };
};
