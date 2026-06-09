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
  <div className="bg-charcoal-core p-6 rounded-2xl shadow-sm border border-whisper-border mt-12">
    <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-4">Ask CarbonWise AI</h2>
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        value={chatMsg}
        onChange={(e) => setChatMsg(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleChat()}
        placeholder="Ask about reducing emissions..."
        className="flex-1 p-3 bg-surface-container-high border border-whisper-border rounded-lg focus:ring-2 focus:ring-bio-emerald outline-none text-on-surface placeholder-muted-steel font-body-md"
      />
      <button
        onClick={handleChat}
        disabled={chatLoading}
        className="px-6 py-3 bg-bio-emerald text-deep-void rounded-lg hover:opacity-90 disabled:opacity-50 font-label-sm text-label-sm font-bold"
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
      <div className="p-4 bg-surface-container-high rounded-lg border border-whisper-border text-on-surface font-body-md leading-relaxed">
        {chatResp}
      </div>
    )}
  </div>
);
