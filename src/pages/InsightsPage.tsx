/**
 * @module pages/InsightsPage
 * @description Displays AI-generated weekly insights and provides a chat assistant.
 */
import React from 'react';

import { useInsights } from '../hooks';
import { CATEGORY_COLORS } from '../constants';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { InsightChat } from '../components/insights/InsightChat';

export const InsightsPage: React.FC = (): React.ReactElement => {
  const {
    insights,
    loading,
    error,
    chatMsg,
    setChatMsg,
    chatResp,
    chatLoading,
    activitiesCount,
    fetchInsights,
    handleRegenerate,
    handleChat,
    lastGenTime,
  } = useInsights();

  const getIcon = (cat: string): string => {
    if (cat === 'transport') return '🚗';
    if (cat === 'food') return '🍔';
    if (cat === 'energy') return '⚡';
    if (cat === 'shopping') return '🛍️';
    return '💡';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600 mt-1">Personalized advice based on your logs.</p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={loading || Date.now() - lastGenTime < 60000}
          className="px-4 py-2 bg-carbon-100 text-carbon-700 font-medium rounded-lg hover:bg-carbon-200 disabled:opacity-50"
        >
          Regenerate Insights
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center">
          <p>{error}</p>
          <button
            onClick={fetchInsights}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      ) : activitiesCount === 0 ? (
        <div className="p-6 bg-gray-50 text-gray-600 rounded-xl text-center border border-dashed border-gray-300">
          Log some activities first to get personalized insights!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((i) => (
            <div
              key={i.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl mb-4"
                style={{
                  backgroundColor:
                    CATEGORY_COLORS[i.category as keyof typeof CATEGORY_COLORS] || '#e5e7eb',
                }}
              >
                {getIcon(i.category || 'general')}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{i.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">{i.body}</p>
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
  );
};
