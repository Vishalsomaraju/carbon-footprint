/**
 * @module pages/InsightsPage
 */

import React, { useState, useEffect } from 'react';

import { useActivities, useGeminiInsights } from '../hooks';
import { InsightCard } from '../components/features/InsightCard';
import { ChatSection } from '../components/features/ChatSection';
import { LoadingSpinner } from '../components/ui';
import { trackError } from '../services/analyticsService';

export const InsightsPage: React.FC = () => {
  const { activities } = useActivities();
  const { insights, loading: insightsLoading, generateInsights } = useGeminiInsights();

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (activities.length > 0 && insights.length === 0) {
      generateInsights(activities).catch(err => trackError(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities.length, insights.length]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return (): void => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleRegenerate = async (): Promise<void> => {
    if (cooldown > 0) return;
    try {
      await generateInsights(activities);
      setCooldown(60);
    } catch (err) {
      trackError(err as Error);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600 mt-1">Personalized tips to reduce your footprint.</p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={cooldown > 0 || insightsLoading}
          className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {cooldown > 0 ? `Regenerate in ${cooldown}s` : 'Regenerate Insights'}
        </button>
      </div>

      <section>
        {insightsLoading ? (
          <div className="flex justify-center p-12"><LoadingSpinner size="lg" /></div>
        ) : insights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 bg-white p-6 rounded-lg border text-center">
            Log some activities to get your personalized AI insights.
          </p>
        )}
      </section>

      <ChatSection activities={activities} />
    </div>
  );
};
