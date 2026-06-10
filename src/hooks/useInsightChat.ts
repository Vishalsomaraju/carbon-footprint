/**
 * @module hooks/useInsightChat
 */
import { useState, useCallback } from 'react';

import { getReductionChat } from '../services/geminiService';
import { useAsync } from './useAsync';

export const useInsightChat = (activitiesCount: number): {
  chatMsg: string;
  setChatMsg: (v: string) => void;
  chatResp: string;
  chatLoading: boolean;
  handleChat: () => Promise<void>;
} => {
  const [chatMsg, setChatMsg] = useState('');
  const [chatResp, setChatResp] = useState('');

  const {
    execute: doChat,
    loading: chatLoading,
  } = useAsync(
    useCallback(async (): Promise<void> => {
      if (!chatMsg.trim()) return;
      setChatResp('');
      const context = `User has ${activitiesCount} activities logged.`;
      const response = await getReductionChat(chatMsg, context);
      setChatResp(response);
      setChatMsg('');
    }, [activitiesCount, chatMsg])
  );

  const handleChat = async (): Promise<void> => {
    try {
      await doChat();
    } catch (err) {
      setChatResp('Sorry, I encountered an error. Try again.');
    }
  };

  return {
    chatMsg,
    setChatMsg,
    chatResp,
    chatLoading,
    handleChat,
  };
};
