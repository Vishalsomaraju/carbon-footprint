/**
 * @module services/authService
 */

import { signInWithPopup, signOut, User } from 'firebase/auth';

import { auth, googleProvider } from '../config';
import { trackError } from '../utils/errorTracker';

export const authService = {
  signInWithGoogle: async (): Promise<User> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: unknown) {
      trackError(error);
      console.error("Error signing in with Google", error);
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      trackError(error);
      console.error("Error signing out", error);
      throw error;
    }
  }
};
