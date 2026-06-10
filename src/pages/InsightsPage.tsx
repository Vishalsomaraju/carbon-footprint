/**
 * @module pages/InsightsPage
 * @description Displays AI-generated weekly insights and provides a chat assistant.
 */
import React from 'react';

import { useInsights, useInsightChat } from '../hooks';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { InsightChat } from '../components/insights/InsightChat';

export const InsightsPage: React.FC = (): React.ReactElement => {
  const {
    insights,
    loading,
    error,
    activitiesCount,
    fetchInsights,
    handleRegenerate,
    lastGenTime,
  } = useInsights();

  const {
    chatMsg,
    setChatMsg,
    chatResp,
    chatLoading,
    handleChat,
  } = useInsightChat(activitiesCount);

  const getCategoryIcon = (cat: string): string => {
    if (cat === 'transport') return 'electric_car';
    if (cat === 'food') return 'restaurant';
    if (cat === 'energy') return 'bolt';
    if (cat === 'shopping') return 'shopping_bag';
    return 'lightbulb';
  };

  return (
    <div className="flex-1 overflow-y-auto p-gutter-md lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex justify-between items-center bg-charcoal-core p-6 rounded-2xl border border-whisper-border shadow-sm">
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
              AI Insights
            </h1>
            <p className="font-body-md text-body-md text-muted-steel mt-1">
              Personalized advice based on your logs.
            </p>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={loading || Date.now() - lastGenTime < 60000}
            className="px-4 py-2 bg-surface-container-high text-on-surface font-medium rounded-lg hover:bg-surface-variant disabled:opacity-50 border border-whisper-border"
          >
            Regenerate Insights
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="p-6 bg-charcoal-core text-critical-crimson rounded-2xl border border-critical-crimson/40 text-center">
            <p>{error}</p>
            <button
              onClick={fetchInsights}
              className="mt-4 px-4 py-2 bg-critical-crimson text-white rounded-lg hover:bg-critical-crimson/90"
            >
              Retry
            </button>
          </div>
        ) : activitiesCount === 0 ? (
          <div className="p-6 bg-charcoal-core text-muted-steel rounded-2xl text-center border border-dashed border-whisper-border">
            Log some activities first to get personalized insights!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((i) => (
              <div
                key={i.id}
                className="bg-charcoal-core p-6 rounded-2xl border border-whisper-border flex flex-col"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-whisper-border flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-bio-emerald">
                    {getCategoryIcon(i.category || 'general')}
                  </span>
                </div>
                <h3 className="font-bold text-on-surface mb-2">{i.title}</h3>
                <p className="font-body-md text-body-md text-muted-steel leading-relaxed flex-grow">
                  {i.body}
                </p>
              </div>
            ))}
          </div>
        )}

        <InsightChat
          chatMsg={chatMsg}
          setChatMsg={setChatMsg}
          handleChat={handleChat}
          chatLoading={chatLoading}
          chatResp={chatResp}
        />
      </div>
    </div>
  );
};
