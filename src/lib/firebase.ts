/**
 * @module config/firebase
 * @description Firebase initialization and service exports.
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

import { env } from '../lib/env';

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Explicitly use localStorage so credentials survive the redirect on localhost
// without needing cross-origin access to firebaseapp.com storage.
// Guard for test environment where Firebase is mocked.
if (import.meta.env.MODE !== 'test') {
  void setPersistence(auth, browserLocalPersistence);
}
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics =
  typeof window !== 'undefined' && env.FIREBASE_MEASUREMENT_ID && import.meta.env.MODE !== 'test'
    ? getAnalytics(app)
    : null;
