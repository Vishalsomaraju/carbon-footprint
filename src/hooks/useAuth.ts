import type { User } from 'firebase/auth';
import { useState } from 'react';

import { trackError } from '../utils/errorTracker';
import { authService, analyticsService } from '../services';
import { useAuthContext } from '../contexts/AuthContext';

export const useAuth = (): {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
} => {
  const { user, loading } = useAuthContext();
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);


  const login = async (): Promise<void> => {
    setIsAuthenticating(true);
    setError(null);
    try {
      await authService.signInWithGoogle();
    } catch (err: unknown) {
      trackError(err as Error);
      setError(err as Error);
      setIsAuthenticating(false);
      throw err;
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
