/**
 * @module hooks/useGeminiInsights.test
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useGeminiInsights } from '../../hooks/useGeminiInsights';
import { geminiService } from '../../services';

vi.mock('../../services', (): Record<string, unknown> => ({
  geminiService: {
    generateWeeklyInsights: vi.fn()
  }
}));

describe('useGeminiInsights', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  it('should initialize with empty insights', (): void => {
    const { result } = renderHook(() => useGeminiInsights());
    expect(result.current.insights).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should generate insights successfully', async (): Promise<void> => {
    const mockInsights = [{ id: '1', type: 'tip', title: 'Walk more', body: 'Walk more to reduce transport emissions', category: 'transport', generatedAt: Date.now() }];
    (geminiService.generateWeeklyInsights as import('vitest').Mock).mockResolvedValue(mockInsights);
    
    const { result } = renderHook(() => useGeminiInsights());

    await act(async () => {
      await result.current.generateInsights([]);
    });

    expect(geminiService.generateWeeklyInsights).toHaveBeenCalledWith([]);
    expect(result.current.insights).toEqual(mockInsights);
    expect(result.current.loading).toBe(false);
  });

  it('should handle errors when generating insights', async (): Promise<void> => {
    const error = new Error('Failed to generate');
    (geminiService.generateWeeklyInsights as import('vitest').Mock).mockRejectedValue(error);
    
    const { result } = renderHook(() => useGeminiInsights());

    await act(async () => {
      await expect(result.current.generateInsights([])).rejects.toThrow('Failed to generate');
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.insights).toEqual([]);
    expect(result.current.loading).toBe(false);
  });
});
