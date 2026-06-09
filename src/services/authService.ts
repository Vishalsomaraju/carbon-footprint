/**
 * @module services/authService
 */

import { signInWithRedirect, signOut, getRedirectResult, UserCredential } from 'firebase/auth';

import { auth, googleProvider } from '../lib/firebase';
import { trackError } from '../utils/errorTracker';

export const authService = {
  signInWithGoogle: async (): Promise<void> => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error: unknown) {
      trackError(error);
      console.error('Error signing in with Google', error);
      throw error;
    }
  },

  handleRedirectResult: async (): Promise<UserCredential | null> => {
    try {
      return await getRedirectResult(auth);
    } catch (error: unknown) {
      trackError(error);
      console.error('Error handling redirect result', error);
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
