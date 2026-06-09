import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setPersistence } from 'firebase/auth';

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  browserLocalPersistence: {},
  setPersistence: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
}));

vi.mock('../../lib/env', () => ({
  env: {
    FIREBASE_API_KEY: 'test',
    FIREBASE_AUTH_DOMAIN: 'test',
    FIREBASE_PROJECT_ID: 'test',
    FIREBASE_STORAGE_BUCKET: 'test',
    FIREBASE_MESSAGING_SENDER_ID: 'test',
    FIREBASE_APP_ID: 'test',
    FIREBASE_MEASUREMENT_ID: 'test',
  },
}));

describe('firebase config', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should initialize without calling setPersistence in test mode', async () => {
    vi.stubEnv('MODE', 'test');

    await import('../../lib/firebase');

    expect(setPersistence).not.toHaveBeenCalled();

    vi.unstubAllEnvs();
  });

  it('should call setPersistence when not in test mode', async () => {
    vi.stubEnv('MODE', 'development');

    await import('../../lib/firebase');

    expect(setPersistence).toHaveBeenCalled();

    vi.unstubAllEnvs();
  });
});
