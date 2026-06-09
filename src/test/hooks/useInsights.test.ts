import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useInsights } from '../../hooks/useInsights';
import { generateWeeklyInsights, getReductionChat } from '../../services/geminiService';
import { useActivities } from '../../hooks/useActivities';
import { trackError } from '../../utils/errorTracker';

vi.mock('../../services/geminiService', () => ({
  generateWeeklyInsights: vi.fn(),
  getReductionChat: vi.fn(),
}));

vi.mock('../../hooks/useActivities', () => ({
  useActivities: vi.fn(),
}));

vi.mock('../../utils/errorTracker', () => ({
  trackError: vi.fn(),
}));

describe('useInsights', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize and set loading false if no activities', () => {
    (useActivities as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      activities: [],
    });

    const { result } = renderHook(() => useInsights());

    expect(result.current.loading).toBe(false);
    expect(result.current.insights).toEqual([]);
    expect(result.current.activitiesCount).toBe(0);
  });

  it('should fetch insights if activities exist', async () => {
    const mockActivities = [{ id: '1', category: 'transport', value: 10 }];
    const mockInsights = [{ type: 'success', title: 'Great', description: 'Good job' }];
    
    (useActivities as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      activities: mockActivities,
    });
    (generateWeeklyInsights as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockInsights);

    const { result } = renderHook(() => useInsights());

    expect(result.current.loading).toBe(true); // initially true

    await act(async () => {
      // wait for effect to run fetchInsights
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.insights).toEqual(mockInsights);
    expect(result.current.activitiesCount).toBe(1);
    expect(generateWeeklyInsights).toHaveBeenCalledWith(mockActivities);
  });

  it('should handle fetch insights error', async () => {
    const mockActivities = [{ id: '1', category: 'transport', value: 10 }];
    
    (useActivities as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      activities: mockActivities,
    });
    (generateWeeklyInsights as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useInsights());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.insights).toEqual([]);
    expect(result.current.error).toBe('Failed to load insights. Please try again later.');
    expect(trackError).toHaveBeenCalledWith(expect.any(Error), 'fetchInsights UI');
  });

  it('should not regenerate if less than 60s since last gen', async () => {
    const mockActivities = [{ id: '1', category: 'transport', value: 10 }];
    (useActivities as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      activities: mockActivities,
    });
    (generateWeeklyInsights as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const { result } = renderHook(() => useInsights());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Reset mock count
    (generateWeeklyInsights as unknown as ReturnType<typeof vi.fn>).mockClear();

    act(() => {
      result.current.handleRegenerate();
    });

    expect(generateWeeklyInsights).not.toHaveBeenCalled();
  });

  it('should handle chat', async () => {
    (useActivities as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ activities: [] });
    (getReductionChat as unknown as ReturnType<typeof vi.fn>).mockResolvedValue('Chat response');

    const { result } = renderHook(() => useInsights());

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
    (useActivities as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ activities: [] });

    const { result } = renderHook(() => useInsights());

    await act(async () => {
      await result.current.handleChat();
    });

    expect(getReductionChat).not.toHaveBeenCalled();
  });

  it('should handle chat error', async () => {
    (useActivities as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ activities: [] });
    (getReductionChat as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Chat error'));

    const { result } = renderHook(() => useInsights());

    act(() => {
      result.current.setChatMsg('Hello');
    });

    await act(async () => {
      await result.current.handleChat();
    });

    expect(result.current.chatResp).toBe('Sorry, I encountered an error. Try again.');
    expect(trackError).toHaveBeenCalledWith(expect.any(Error), 'handleChat UI');
  });
});
