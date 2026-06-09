/**
 * @module services/authService
 */

import { signInWithPopup, signOut, User, AuthError } from 'firebase/auth';

import { auth, googleProvider } from '../lib/firebase';
import { trackError } from '../utils/errorTracker';

export const authService = {
  signInWithGoogle: async (): Promise<User | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: unknown) {
      const authError = error as AuthError;
      // User deliberately closed the popup — not a real error
      if (authError?.code === 'auth/popup-closed-by-user' ||
          authError?.code === 'auth/cancelled-popup-request') {
        return null;
      }
      trackError(error);
      console.error('Error signing in with Google', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      trackError(error);
      console.error('Error signing out', error);
      throw error;
    }
  },
};
