/**
 * @module hooks/useAuth.test
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useAuthContext } from '../store/AuthContext';
import { useAuth } from './useAuth';
import { authService, analyticsService } from '../services';

// Mock contexts and services
vi.mock('../store/AuthContext', () => ({
  useAuthContext: vi.fn(() => ({ user: null, loading: false }))
}));

vi.mock('../services', () => ({
  authService: {
    signInWithGoogle: vi.fn(),
    logout: vi.fn()
  },
  analyticsService: {
    logEvent: vi.fn()
  }
}));
describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle login successfully', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    (authService.signInWithGoogle as any).mockResolvedValue(mockUser);
    
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const user = await result.current.login();
      expect(user).toEqual(mockUser);
    });

    expect(authService.signInWithGoogle).toHaveBeenCalledTimes(1);
    expect(analyticsService.logEvent).toHaveBeenCalledWith('login', { method: 'google' });
    expect(result.current.error).toBeNull();
  });

  it('should handle login error', async () => {
    const error = new Error('Login failed');
    (authService.signInWithGoogle as any).mockRejectedValue(error);
    
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(result.current.login()).rejects.toThrow('Login failed');
    });

    expect(result.current.error).toEqual(error);
    expect(analyticsService.logEvent).not.toHaveBeenCalled();
  });

  it('should handle logout successfully', async () => {
    (useAuthContext as any).mockReturnValue({ user: { uid: '123' }, loading: false });
    (authService.logout as any).mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(authService.logout).toHaveBeenCalledTimes(1);
    expect(analyticsService.logEvent).toHaveBeenCalledWith('logout');
  });

  it('should handle logout error', async () => {
    const error = new Error('Logout failed');
    (authService.logout as any).mockRejectedValue(error);
    
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(result.current.logout()).rejects.toThrow('Logout failed');
    });

    expect(result.current.error).toEqual(error);
  });
});
