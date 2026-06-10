/**
 * @module hooks/useAuth
 */
import { useCallback } from 'react';
import type { User } from 'firebase/auth';

import { authService, analyticsService } from '../services';
import { useAuthContext } from '../contexts/AuthContext';
import { useAsync } from './useAsync';

export const useAuth = (): {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
} => {
  const { user, loading } = useAuthContext();

  const {
    execute: login,
    loading: loginLoading,
    error: loginError,
  } = useAsync(
    useCallback(async (): Promise<void> => {
      const loggedInUser = await authService.signInWithGoogle();
      if (loggedInUser) {
        analyticsService.logEvent('login', { method: 'google' });
      }
    }, [])
  );

  const {
    execute: logout,
    loading: logoutLoading,
    error: logoutError,
  } = useAsync(
    useCallback(async (): Promise<void> => {
      await authService.logout();
      analyticsService.logEvent('logout');
    }, [])
  );

  return {
    user,
    loading: loading || loginLoading || logoutLoading,
    error: loginError || logoutError,
    login,
    logout,
  };
};
