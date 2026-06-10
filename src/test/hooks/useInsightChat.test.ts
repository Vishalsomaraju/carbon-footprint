import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useInsightChat } from '../../hooks/useInsightChat';
import { getReductionChat } from '../../services/geminiService';
import { trackError } from '../../utils/errorTracker';

vi.mock('../../services/geminiService', () => ({
  getReductionChat: vi.fn(),
}));

vi.mock('../../utils/errorTracker', () => ({
  trackError: vi.fn(),
}));

describe('useInsightChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle chat', async () => {
    (getReductionChat as unknown as ReturnType<typeof vi.fn>).mockResolvedValue('Chat response');

    const { result } = renderHook(() => useInsightChat(0));

    act(() => {
      result.current.setChatMsg('Hello');
    });

    await act(async () => {
      await result.current.handleChat();
    });

    expect(result.current.chatResp).toBe('Chat response');
    expect(result.current.chatMsg).toBe('');
    expect(getReductionChat).toHaveBeenCalledWith('Hello', 'User has 0 activities logged.');
  });

  it('should not chat if msg is empty', async () => {
    const { result } = renderHook(() => useInsightChat(0));

    await act(async () => {
      await result.current.handleChat();
    });

    expect(getReductionChat).not.toHaveBeenCalled();
  });

  it('should handle chat error', async () => {
    (getReductionChat as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Chat error'),
    );

    const { result } = renderHook(() => useInsightChat(0));

    act(() => {
      result.current.setChatMsg('Hello');
    });

    await act(async () => {
      await result.current.handleChat();
    });

    expect(result.current.chatResp).toBe('Sorry, I encountered an error. Try again.');
    expect(trackError).toHaveBeenCalledWith(expect.any(Error));
  });
});
