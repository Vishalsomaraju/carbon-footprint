/**
 * @module services/authService
 */

import { signInWithPopup, signOut } from 'firebase/auth';

import { auth, googleProvider } from '../config';

export const authService = {
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
      throw error;
    }
  }
};
