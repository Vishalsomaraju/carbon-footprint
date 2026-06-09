/**
 * @module hooks/useAuth.test
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useAuthContext } from '../../contexts/AuthContext';
import { useAuth } from '../../hooks/useAuth';
import { authService, analyticsService } from '../../services';

// Mock contexts and services
vi.mock('../../contexts/AuthContext', (): Record<string, unknown> => ({
  useAuthContext: vi.fn((): import("react").ReactElement => ({ user: null, loading: false }))
}));

vi.mock('../../services', (): Record<string, unknown> => ({
  authService: {
    signInWithGoogle: vi.fn(),
    logout: vi.fn()
  },
  analyticsService: {
    logEvent: vi.fn()
  }
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
    const mockUser = { uid: '123', email: 'test@example.com' };
    (authService.signInWithGoogle as import('vitest').Mock).mockResolvedValue(mockUser);
    
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const user = await result.current.login();
      expect(user).toEqual(mockUser);
    });

    expect(authService.signInWithGoogle).toHaveBeenCalledTimes(1);
    expect(analyticsService.logEvent).toHaveBeenCalledWith('login', { method: 'google' });
    expect(result.current.error).toBeNull();
  });

  it('should handle login error', async (): Promise<void> => {
    const error = new Error('Login failed');
    (authService.signInWithGoogle as import('vitest').Mock).mockRejectedValue(error);
    
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(result.current.login()).rejects.toThrow('Login failed');
    });

    expect(result.current.error).toEqual(error);
    expect(analyticsService.logEvent).not.toHaveBeenCalled();
  });

  it('should handle logout successfully', async (): Promise<void> => {
    (useAuthContext as import('vitest').Mock).mockReturnValue({ user: { uid: '123' }, loading: false });
    (authService.logout as import('vitest').Mock).mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(authService.logout).toHaveBeenCalledTimes(1);
    expect(analyticsService.logEvent).toHaveBeenCalledWith('logout');
  });

  it('should handle logout error', async (): Promise<void> => {
    const error = new Error('Logout failed');
    (authService.logout as import('vitest').Mock).mockRejectedValue(error);
    
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(result.current.logout()).rejects.toThrow('Logout failed');
    });

    expect(result.current.error).toEqual(error);
  });
});
