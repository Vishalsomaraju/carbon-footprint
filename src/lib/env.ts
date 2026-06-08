/// <reference types="vite/client" />

/**
 * @module env
 * @description Environment variable validation. Fails loudly at startup if misconfigured.
 */

interface EnvConfig {
  readonly FIREBASE_API_KEY: string;
  readonly FIREBASE_AUTH_DOMAIN: string;
  readonly FIREBASE_PROJECT_ID: string;
  readonly FIREBASE_STORAGE_BUCKET: string;
  readonly FIREBASE_MESSAGING_SENDER_ID: string;
  readonly FIREBASE_APP_ID: string;
  readonly FIREBASE_MEASUREMENT_ID: string;
  readonly GEMINI_API_KEY: string;
  readonly MAPS_API_KEY: string;
}

function validateEnv(): EnvConfig {
  const required: Array<keyof EnvConfig> = [
    'FIREBASE_API_KEY', 'FIREBASE_AUTH_DOMAIN', 'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET', 'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID', 'FIREBASE_MEASUREMENT_ID', 'GEMINI_API_KEY', 'MAPS_API_KEY',
  ];

  const missing = required.filter(
    (key) => !import.meta.env[`VITE_${key}`]
  );

  if (missing.length > 0 && import.meta.env.MODE !== 'test') {
    throw new Error(`Missing required environment variables: ${missing.map(k => `VITE_${k}`).join(', ')}`);
  }

  return Object.fromEntries(
    required.map((key) => [key, import.meta.env[`VITE_${key}`] as string])
  ) as unknown as EnvConfig;
}

export const env = validateEnv();
