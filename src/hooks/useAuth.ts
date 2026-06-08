/**
 * @module hooks/useAuth
 */

import { useState } from 'react';

import { authService, analyticsService } from '../services';
import { useAuthContext } from '../store/AuthContext';

export const useAuth = () => {
  const { user, loading } = useAuthContext();
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const login = async () => {
    setIsAuthenticating(true);
    setError(null);
    try {
      const loggedInUser = await authService.signInWithGoogle();
      analyticsService.logEvent('login', { method: 'google' });
      return loggedInUser;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    setIsAuthenticating(true);
    try {
      await authService.logout();
      analyticsService.logEvent('logout');
    } catch (err: any) {
      setError(err);
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
    logout
  };
};
