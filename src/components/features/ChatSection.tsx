/**
 * @module components/features/ChatSection
 */

import React, { useState } from 'react';

import { Card, LoadingSpinner } from '../ui';
import { geminiService } from '../../services';
import { trackError } from '../../services/analyticsService';
import { ActivityRecord } from '../../types';

interface ChatSectionProps {
  activities: ActivityRecord[];
}

export const ChatSection: React.FC<ChatSectionProps> = ({ activities }) => {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleChatSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatLoading(true);

    try {
      const recentImpact = activities.slice(0, 10).reduce((acc, a) => acc + a.carbonImpact, 0);
      const context = `User has logged ${activities.length} activities. Total recent CO2: ${recentImpact.toFixed(2)}kg.`;
      const aiResponse = await geminiService.getReductionChat(userMessage, context);
      setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (err) {
      trackError(err as Error);
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat with CarbonWise AI</h2>
      <Card className="flex flex-col h-[400px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.length === 0 ? (
            <p className="text-gray-500 text-center mt-12">Ask me anything about reducing your carbon footprint!</p>
          ) : (
            chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))
          )}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <LoadingSpinner size="sm" />
              </div>
            </div>
          )}
        </div>
        <div className="border-t p-4">
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask for more tips..."
              className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
              disabled={chatLoading}
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || chatLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </Card>
    </section>
  );
};
