/**
 * @module test/setup
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

global.ResizeObserver = class ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
};

vi.mock(
  'firebase/app',
  (): Record<string, unknown> => ({
    initializeApp: vi.fn(() => ({})),
  }),
);

vi.mock(
  'firebase/auth',
  (): Record<string, unknown> => ({
    getAuth: vi.fn(() => ({})),
    GoogleAuthProvider: class {},
    onAuthStateChanged: vi.fn(),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
  }),
);

vi.mock(
  'firebase/firestore',
  (): Record<string, unknown> => ({
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
  }),
);
