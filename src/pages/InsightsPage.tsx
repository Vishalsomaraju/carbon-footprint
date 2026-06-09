/**
 * @module pages/InsightsPage
 * @description Displays AI-generated weekly insights and provides a chat assistant.
 */
import React, { useState, useEffect } from 'react';

import { generateWeeklyInsights, getReductionChat } from '../services/geminiService';
import { useActivities } from '../hooks';
import { InsightMessage } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { trackError } from '../utils/errorTracker';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const InsightsPage: React.FC = (): React.ReactElement => {
  const { activities } = useActivities();
  const [insights, setInsights] = useState<InsightMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastGenTime, setLastGenTime] = useState(0);

  const [chatMsg, setChatMsg] = useState('');
  const [chatResp, setChatResp] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const fetchInsights = async (): Promise<void> => {
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
  };

  useEffect(() => {
    if (activities.length > 0 && insights.length === 0) {
      fetchInsights();
    } else if (activities.length === 0) {
      setLoading(false);
    }
  }, [activities.length, insights.length]);

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
          disabled={loading || (Date.now() - lastGenTime < 60000)}
          className="px-4 py-2 bg-carbon-100 text-carbon-700 font-medium rounded-lg hover:bg-carbon-200 disabled:opacity-50"
        >
          Regenerate Insights
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><LoadingSpinner size="lg" /></div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center">
          <p>{error}</p>
          <button onClick={fetchInsights} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">Retry</button>
        </div>
      ) : activities.length === 0 ? (
        <div className="p-6 bg-gray-50 text-gray-600 rounded-xl text-center border border-dashed border-gray-300">
          Log some activities first to get personalized insights!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map(i => (
            <div key={i.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mb-4" style={{ backgroundColor: CATEGORY_COLORS[i.category as keyof typeof CATEGORY_COLORS] || '#e5e7eb' }}>
                {getIcon(i.category || 'general')}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{i.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">{i.body}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ask CarbonWise AI</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={chatMsg}
            onChange={(e) => setChatMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
            placeholder="Ask about reducing emissions..."
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-carbon-500 outline-none"
          />
          <button onClick={handleChat} disabled={chatLoading} className="px-6 py-3 bg-carbon-600 text-white rounded-lg hover:bg-carbon-700 disabled:opacity-50 font-medium">
            Send
          </button>
        </div>
        {chatLoading && <div className="p-4"><LoadingSpinner size="sm" /></div>}
        {chatResp && (
          <div className="p-4 bg-carbon-50 rounded-lg border border-carbon-100 text-carbon-800 leading-relaxed">
            {chatResp}
          </div>
        )}
      </div>
    </div>
  );
};
