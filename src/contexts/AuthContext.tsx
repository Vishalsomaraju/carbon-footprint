/**
 * @module contexts/AuthContext
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, getRedirectResult } from 'firebase/auth';

import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First, process any pending redirect result so onAuthStateChanged sees the user
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log('[AuthContext] Redirect result processed for:', result.user.email);
        } else {
          console.log('[AuthContext] No pending redirect result.');
        }
      })
      .catch((err) => {
        console.error('[AuthContext] getRedirectResult error:', err);
      });

    // Subscribe to auth state changes after the redirect result check
    const unsubscribe = onAuthStateChanged(auth, (currentUser): void => {
      console.log('[AuthContext] onAuthStateChanged fired. User:', currentUser?.email ?? 'null');
      setUser(currentUser);
      setLoading(false);
    });

    return (): void => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => useContext(AuthContext);
