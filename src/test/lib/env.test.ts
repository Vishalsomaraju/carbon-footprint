import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('env validation', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should validate and return environment variables in production/development mode', async () => {
    vi.stubEnv('MODE', 'production');

    // We need to mock import.meta.env
    // Because vitest controls import.meta.env, we can populate it
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'key');
    vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'domain');
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'id');
    vi.stubEnv('VITE_FIREBASE_STORAGE_BUCKET', 'bucket');
    vi.stubEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', 'sender');
    vi.stubEnv('VITE_FIREBASE_APP_ID', 'app');
    vi.stubEnv('VITE_FIREBASE_MEASUREMENT_ID', 'measurement');
    vi.stubEnv('VITE_GEMINI_API_KEY', 'gemini');
    vi.stubEnv('VITE_MAPS_API_KEY', 'maps');

    const { env } = await import('../../lib/env');

    expect(env.FIREBASE_API_KEY).toBe('key');
    expect(env.FIREBASE_AUTH_DOMAIN).toBe('domain');
    expect(env.FIREBASE_PROJECT_ID).toBe('id');
    expect(env.FIREBASE_STORAGE_BUCKET).toBe('bucket');
    expect(env.FIREBASE_MESSAGING_SENDER_ID).toBe('sender');
    expect(env.FIREBASE_APP_ID).toBe('app');
    expect(env.FIREBASE_MEASUREMENT_ID).toBe('measurement');
    expect(env.GEMINI_API_KEY).toBe('gemini');
    expect(env.MAPS_API_KEY).toBe('maps');

    vi.unstubAllEnvs();
  });

  it('should throw an error if environment variables are invalid in production/development mode', async () => {
    vi.stubEnv('MODE', 'production');
    vi.stubEnv('VITE_FIREBASE_API_KEY', ''); // Invalid

    await expect(import('../../lib/env')).rejects.toThrow(
      'Invalid environment variables. Check console for details.',
    );

    vi.unstubAllEnvs();
  });
});
