/**
 * @module hooks/useAuth
 */
import type { User } from 'firebase/auth';
import { useState } from 'react';

import { trackError } from '../utils/errorTracker';
import { authService, analyticsService } from '../services';
import { useAuthContext } from '../contexts/AuthContext';

export const useAuth = (): {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: () => Promise<User>;
  logout: () => Promise<void>;
} => {
  const { user, loading } = useAuthContext();
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const login = async (): Promise<User> => {
    setIsAuthenticating(true);
    setError(null);
    try {
      const loggedInUser = await authService.signInWithGoogle();
      analyticsService.logEvent('login', { method: 'google' });
      return loggedInUser;
    } catch (err: unknown) {
      trackError(err);
      setError(err as Error);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsAuthenticating(true);
    try {
      await authService.logout();
      analyticsService.logEvent('logout');
    } catch (err: unknown) {
      trackError(err);
      setError(err as Error);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    user,
    loading: loading || isAuthenticating,
    error,
    login,
    logout,
  };
};
