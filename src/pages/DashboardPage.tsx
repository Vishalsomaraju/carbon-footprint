/**
 * @module pages/DashboardPage
 */

import React, { useEffect, useCallback } from 'react';

import { useAuth, useActivities, useGeminiInsights } from '../hooks';
import { ActivityForm, FootprintChart, InsightCard } from '../components/features';
import { LoadingSpinner } from '../components/ui';

export const DashboardPage: React.FC = (): React.ReactElement => {
  const { user } = useAuth();
  const { activities, loading: activitiesLoading, addActivity } = useActivities();
  const { insights, loading: insightsLoading, generateInsights } = useGeminiInsights();

  const handleSubmit = useCallback(async (activityData: { category: string; subCategory: string; value: number; description: string; date: string }): Promise<void> => {
    await addActivity(activityData);
  }, [addActivity]);

  useEffect(() => {
    if (activities.length > 0 && insights.length === 0) {
      generateInsights(activities);
    }
  }, [activities, insights.length, generateInsights]);

  if (activitiesLoading && activities.length === 0) {
    return <div className="flex justify-center p-12"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.displayName || 'Eco-Warrior'}!</h1>
        <p className="text-gray-600 mt-1">Here is your carbon footprint summary.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <ActivityForm onSubmit={handleSubmit} isLoading={activitiesLoading} />
        </div>

        <div className="lg:col-span-2 space-y-8">
          <FootprintChart activities={activities} />

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Insights</h2>
            {insightsLoading ? (
              <div className="flex justify-center p-8"><LoadingSpinner /></div>
            ) : insights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight: import('../types').InsightMessage) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 bg-white p-6 rounded-lg border">
                Log more activities to get personalized AI insights!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
