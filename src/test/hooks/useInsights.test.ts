import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useInsights } from '../../hooks/useInsights';
import { generateWeeklyInsights } from '../../services/geminiService';
import { useActivities } from '../../hooks/useActivities';
import { trackError } from '../../utils/errorTracker';

vi.mock('../../services/geminiService', () => ({
  generateWeeklyInsights: vi.fn(),
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
    (generateWeeklyInsights as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('API error'),
    );

    const { result } = renderHook(() => useInsights());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.insights).toEqual([]);
    expect(result.current.error).toBe('Failed to load insights. Please try again later.');
    expect(trackError).toHaveBeenCalledWith(expect.any(Error));
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

  it('should regenerate if more than 60s since last gen', async () => {
    vi.useFakeTimers();
    try {
      const mockActivities = [{ id: '1', category: 'transport', value: 10 }];
      (useActivities as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        activities: mockActivities,
      });
      (generateWeeklyInsights as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      const { result } = renderHook(() => useInsights());

      await act(async () => {
        vi.advanceTimersByTime(1);
      });

      // Reset mock count after initial fetch
      (generateWeeklyInsights as unknown as ReturnType<typeof vi.fn>).mockClear();

      // Fast-forward 61 seconds
      vi.advanceTimersByTime(61000);

      await act(async () => {
        result.current.handleRegenerate();
        vi.advanceTimersByTime(1);
      });

      expect(generateWeeklyInsights).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
