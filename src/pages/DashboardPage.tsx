/**
 * @module pages/DashboardPage
 * @description Core user dashboard showing footprint stats.
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth, useActivities } from '../hooks';
import { DailySummaryCard } from '../components/dashboard/DailySummaryCard';
import { WeeklyChart } from '../components/dashboard/WeeklyChart';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
import { StreakBadge } from '../components/dashboard/StreakBadge';
import { LoadingSpinner } from '../components/ui';

export const DashboardPage: React.FC = (): React.ReactElement => {
  const { user } = useAuth();
  const { activities, loading } = useActivities();
  const navigate = useNavigate();

  const todayTotal = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return activities.filter(a => a.date.startsWith(today)).reduce((sum, a) => sum + (a.carbonImpact || 0), 0);
  }, [activities]);

  if (loading && !activities.length) {
    return <div className="flex justify-center p-12"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.displayName || 'Eco-Warrior'}!</h1>
          <p className="text-gray-600 mt-1">Here is your carbon footprint summary.</p>
        </div>
        <div className="flex items-center gap-4">
          <StreakBadge activities={activities} />
          <button 
            onClick={() => navigate('/log')}
            className="px-6 py-2.5 bg-carbon-600 text-white font-medium rounded-lg hover:bg-carbon-700 transition-colors shadow-sm"
          >
            Log Activity
          </button>
        </div>
      </div>

      {!activities.length ? (
        <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌱</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No activities logged yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">Start tracking your daily choices to see your carbon footprint and get AI-powered insights.</p>
          <button onClick={() => navigate('/log')} className="text-carbon-600 font-bold hover:underline">Log your first activity &rarr;</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <DailySummaryCard totalKg={todayTotal} />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <CategoryBreakdown activities={activities} />
            <WeeklyChart activities={activities} />
          </div>
        </div>
      )}
    </div>
  );
};
