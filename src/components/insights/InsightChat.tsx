/**
 * @module components/insights/InsightChat
 */
import React from 'react';

import { LoadingSpinner } from '../ui/LoadingSpinner';

interface InsightChatProps {
  chatMsg: string;
  setChatMsg: (val: string) => void;
  handleChat: () => void;
  chatLoading: boolean;
  chatResp: string;
}

export const InsightChat: React.FC<InsightChatProps> = ({
  chatMsg,
  setChatMsg,
  handleChat,
  chatLoading,
  chatResp,
}): import('react').ReactElement => (
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
      <button
        onClick={handleChat}
        disabled={chatLoading}
        className="px-6 py-3 bg-carbon-600 text-white rounded-lg hover:bg-carbon-700 disabled:opacity-50 font-medium"
      >
        Send
      </button>
    </div>
    {chatLoading && (
      <div className="p-4">
        <LoadingSpinner size="sm" />
      </div>
    )}
    {chatResp && (
      <div className="p-4 bg-carbon-50 rounded-lg border border-carbon-100 text-carbon-800 leading-relaxed">
        {chatResp}
      </div>
    )}
  </div>
);
