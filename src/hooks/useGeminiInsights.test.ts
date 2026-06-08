/**
 * @module hooks/useGeminiInsights.test
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useGeminiInsights } from './useGeminiInsights';
import { geminiService } from '../services';

vi.mock('../services', () => ({
  geminiService: {
    generateInsights: vi.fn()
  }
}));

describe('useGeminiInsights', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty insights', () => {
    const { result } = renderHook(() => useGeminiInsights());
    expect(result.current.insights).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should generate insights successfully', async () => {
    const mockInsights = [{ id: '1', category: 'transport', text: 'Walk more' }];
    (geminiService.generateInsights as any).mockResolvedValue(mockInsights);
    
    const { result } = renderHook(() => useGeminiInsights());

    await act(async () => {
      await result.current.generateInsights([]);
    });

    expect(geminiService.generateInsights).toHaveBeenCalledWith([]);
    expect(result.current.insights).toEqual(mockInsights);
    expect(result.current.loading).toBe(false);
  });

  it('should handle errors when generating insights', async () => {
    const error = new Error('Failed to generate');
    (geminiService.generateInsights as any).mockRejectedValue(error);
    
    const { result } = renderHook(() => useGeminiInsights());

    await act(async () => {
      await expect(result.current.generateInsights([])).rejects.toThrow('Failed to generate');
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.insights).toEqual([]);
    expect(result.current.loading).toBe(false);
  });
});
