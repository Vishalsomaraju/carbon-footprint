/**
 * @module pages/DashboardPage
 * @description Core user dashboard showing footprint stats.
 */

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth, useActivities } from '../hooks';
import { DailySummaryCard } from '../components/dashboard/DailySummaryCard';
import { WeeklyChart } from '../components/dashboard/WeeklyChart';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
import { StreakBadge } from '../components/dashboard/StreakBadge';

const DashboardSkeleton: React.FC = () => (
  <div 
    role="status" 
    aria-label="Loading dashboard"
    className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-container-max mx-auto animate-pulse"
  >
    <div className="lg:col-span-4 bg-charcoal-core border border-whisper-border rounded-2xl h-64" />
    <div className="lg:col-span-8 bg-charcoal-core border border-whisper-border rounded-2xl h-64" />
    <div className="lg:col-span-12 bg-charcoal-core border border-whisper-border rounded-2xl h-80" />
  </div>
);

export const DashboardPage: React.FC = (): React.ReactElement => {
  const { user } = useAuth();
  const { activities, loading, error } = useActivities();
  const navigate = useNavigate();
  const [errorDismissed, setErrorDismissed] = useState(false);

  const todayTotal = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return activities
      .filter((a) => a.date.startsWith(today))
      .reduce((sum, a) => sum + (a.carbonImpact || 0), 0);
  }, [activities]);

  return (
    <div className="flex-1 overflow-y-auto p-gutter-md lg:p-8">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight hidden sm:block">
          Welcome, {user?.displayName || 'Eco-Warrior'}!
        </h2>
        <div className="flex items-center gap-4">
          <StreakBadge activities={activities} />
          <button
            onClick={() => navigate('/log')}
            className="bg-bio-emerald text-deep-void px-6 py-2 rounded-lg font-label-sm text-label-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }} aria-hidden="true">add_circle</span>
            Log Activity
          </button>
        </div>
      </div>

      {/* Inline error banner — only shown if there's an error AND it wasn't dismissed */}
      {error && !errorDismissed && (
        <div className="mb-6 flex items-start gap-3 bg-charcoal-core border border-critical-crimson/40 text-critical-crimson rounded-xl px-5 py-4">
          <span className="material-symbols-outlined shrink-0 mt-0.5">warning</span>
          <div className="flex-1 min-w-0">
            <p className="font-label-sm text-label-sm font-bold mb-0.5">Could not load activity data</p>
            <p className="font-body-md text-body-md text-muted-steel break-words">{error.message}</p>
          </div>
          <button
            onClick={() => setErrorDismissed(true)}
            className="text-muted-steel hover:text-on-surface transition-colors shrink-0"
            aria-label="Dismiss error"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !activities.length ? (
        <DashboardSkeleton />
      ) : !activities.length ? (
        /* Empty state */
        <div className="text-center p-12 bg-charcoal-core rounded-2xl border border-whisper-border">
          <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">eco</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No activities logged yet</h3>
          <p className="font-body-md text-body-md text-muted-steel max-w-md mx-auto mb-6">
            Start tracking your daily choices to see your carbon footprint and get AI-powered insights.
          </p>
          <button
            onClick={() => navigate('/log')}
            className="text-primary font-bold hover:underline"
          >
            Log your first activity &rarr;
          </button>
        </div>
      ) : (
        /* Data grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-container-max mx-auto">
          <div className="lg:col-span-4 flex flex-col h-full">
            <DailySummaryCard totalKg={todayTotal} />
          </div>
          <div className="lg:col-span-8 flex flex-col h-full">
            <CategoryBreakdown activities={activities} />
          </div>
          <div className="lg:col-span-12 flex flex-col h-full">
            <WeeklyChart activities={activities} />
          </div>
        </div>
      )}
    </div>
  );
};
