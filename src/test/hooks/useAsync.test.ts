import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useAsync } from '../../hooks/useAsync';
import { trackError } from '../../utils/errorTracker';

vi.mock('../../utils/errorTracker', () => ({
  trackError: vi.fn(),
}));

describe('useAsync', () => {
  it('should handle successful execution', async () => {
    const mockAsyncFn = vi.fn().mockResolvedValue('success data');
    const { result } = renderHook(() => useAsync(mockAsyncFn));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    let promise: Promise<string>;
    act(() => {
      promise = result.current.execute('arg1', 'arg2');
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      const res = await promise;
      expect(res).toBe('success data');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe('success data');
    expect(result.current.error).toBeNull();
    expect(mockAsyncFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should handle failed execution', async () => {
    const error = new Error('failed');
    const mockAsyncFn = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useAsync(mockAsyncFn));

    await act(async () => {
      await expect(result.current.execute()).rejects.toThrow('failed');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(error);
    expect(trackError).toHaveBeenCalledWith(error);
  });

  it('should allow manual data setting', () => {
    const mockAsyncFn = vi.fn();
    const { result } = renderHook(() => useAsync(mockAsyncFn));

    act(() => {
      result.current.setData('manual data');
    });

    expect(result.current.data).toBe('manual data');
  });
});
