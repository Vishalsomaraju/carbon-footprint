/**
 * @module hooks/useAuth.test
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useAuthContext } from '../../contexts/AuthContext';
import { useAuth } from '../../hooks/useAuth';
import { authService, analyticsService } from '../../services';

// Mock contexts and services
vi.mock('../../contexts/AuthContext', () => ({
  useAuthContext: vi.fn(() => ({ user: null as null, loading: false })),
}));

vi.mock('../../services', () => ({
  authService: {
    signInWithGoogle: vi.fn(),
    logout: vi.fn(),
  },
  analyticsService: {
    logEvent: vi.fn(),
  },
}));

describe('useAuth', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  it('should return initial state', (): void => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle login successfully', async (): Promise<void> => {
    vi.mocked(authService.signInWithGoogle).mockResolvedValue({
      uid: '123',
    } as unknown as import('firebase/auth').User);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login();
    });

    expect(authService.signInWithGoogle).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
  });

  it('should handle login error', async (): Promise<void> => {
    const error = new Error('Login failed');
    vi.mocked(authService.signInWithGoogle).mockRejectedValue(error);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(result.current.login()).rejects.toThrow('Login failed');
    });

    expect(result.current.error).toEqual(error);
  });

  it('should handle logout successfully', async (): Promise<void> => {
    vi.mocked(useAuthContext).mockReturnValue({
      user: { uid: '123' } as unknown as import('firebase/auth').User,
      loading: false,
    });
    vi.mocked(authService.logout).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(authService.logout).toHaveBeenCalledTimes(1);
    expect(analyticsService.logEvent).toHaveBeenCalledWith('logout');
  });

  it('should handle logout error', async (): Promise<void> => {
    const error = new Error('Logout failed');
    vi.mocked(authService.logout).mockRejectedValue(error);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(result.current.logout()).rejects.toThrow('Logout failed');
    });

    expect(result.current.error).toEqual(error);
  });
});
