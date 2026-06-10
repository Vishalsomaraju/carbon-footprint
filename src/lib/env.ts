/// <reference types="vite/client" />

/**
 * @module env
 * @description Strict environment variable validation using Zod. Fails loudly at startup if misconfigured.
 */
import { z } from 'zod';

const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1, 'Firebase API Key is required'),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase Auth Domain is required'),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase Project ID is required'),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase Storage Bucket is required'),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase Messaging Sender ID is required'),
  VITE_FIREBASE_APP_ID: z.string().min(1, 'Firebase App ID is required'),
  VITE_FIREBASE_MEASUREMENT_ID: z.string().min(1, 'Firebase Measurement ID is required'),
  VITE_GEMINI_API_KEY: z.string().min(1, 'Gemini API Key is required'),
  VITE_MAPS_API_KEY: z.string().min(1, 'Maps API Key is required'),
});

interface Env {
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  FIREBASE_MEASUREMENT_ID: string;
  GEMINI_API_KEY: string;
  MAPS_API_KEY: string;
}

/**
 * Validates process environment variables strictly at boot.
 * Maps VITE_ prefixed variables to internal clean names.
 * @throws {Error} If any required environment variable is missing or malformed.
 * @returns {Env} The validated environment object.
 */
function validateEnv(): Env {
  if (import.meta.env.MODE === 'test') {
    // Return empty strings for testing environment to avoid failure when variables are not set
    return {
      FIREBASE_API_KEY: '',
      FIREBASE_AUTH_DOMAIN: '',
      FIREBASE_PROJECT_ID: '',
      FIREBASE_STORAGE_BUCKET: '',
      FIREBASE_MESSAGING_SENDER_ID: '',
      FIREBASE_APP_ID: '',
      FIREBASE_MEASUREMENT_ID: '',
      GEMINI_API_KEY: '',
      MAPS_API_KEY: '',
    };
  }

  const parsed = envSchema.safeParse(import.meta.env);

  if (!parsed.success) {
    throw new Error('Invalid environment variables. Check console for details.');
  }

  // Strip VITE_ prefix for internal usage
  return {
    FIREBASE_API_KEY: parsed.data.VITE_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: parsed.data.VITE_FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: parsed.data.VITE_FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: parsed.data.VITE_FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: parsed.data.VITE_FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: parsed.data.VITE_FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: parsed.data.VITE_FIREBASE_MEASUREMENT_ID,
    GEMINI_API_KEY: parsed.data.VITE_GEMINI_API_KEY,
    MAPS_API_KEY: parsed.data.VITE_MAPS_API_KEY,
  };
}

export const env = validateEnv();
