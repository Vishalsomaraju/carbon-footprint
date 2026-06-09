/**
 * @module services/authService
 */

import { signInWithPopup, signOut } from 'firebase/auth';

import { auth, googleProvider } from '../config';

export const authService = {
  signInWithGoogle: async (): Promise<User> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
      throw error;
    }
  }
};
