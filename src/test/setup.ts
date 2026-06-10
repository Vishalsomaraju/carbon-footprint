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

import * as React from 'react';
vi.mock('recharts', async () => {
  const OriginalRecharts = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }): React.ReactElement =>
      React.createElement('div', { style: { width: 800, height: 400 } }, children),
  };
});

const originalWarn = console.warn;
console.warn = (...args: unknown[]): void => {
  if (typeof args[0] === 'string' && args[0].includes('React Router Future Flag Warning')) return;
  originalWarn(...args);
};
const originalError = console.error;
console.error = (...args: unknown[]): void => {
  if (typeof args[0] === 'string' && args[0].includes('React Router Future Flag Warning')) return;
  originalError(...args);
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
