/**
 * @module contexts/AuthContext.test
 */

import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { onAuthStateChanged } from 'firebase/auth';

import { AuthProvider, useAuthContext } from '../../contexts/AuthContext';

vi.mock('firebase/auth', (): Record<string, unknown> => ({
  onAuthStateChanged: vi.fn(),
  getAuth: vi.fn(),
  GoogleAuthProvider: class {}
}));

vi.mock('../config', (): Record<string, unknown> => ({
  auth: {}
}));

const TestComponent = (): import('react').ReactElement => {
  const { user, loading } = useAuthContext();
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'done'}</div>
      <div data-testid="user">{user ? user.uid : 'null'}</div>
    </div>
  );
};

describe('AuthContext', (): void => {
  it('should initialize with loading true and handle auth state change', (): void => {
    let callback: (user: { uid: string } | null) => void;
    (onAuthStateChanged as import('vitest').Mock).mockImplementation((_auth: unknown, cb: unknown) => {
      callback = cb as (user: { uid: string } | null) => void;
      return (): void => {}; // unsubscribe fn
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initial state
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    expect(screen.getByTestId('user')).toHaveTextContent('null');

    // Simulate auth state change
    act(() => {
      callback({ uid: '123' });
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('done');
    expect(screen.getByTestId('user')).toHaveTextContent('123');
  });

  it('should handle unauthenticated state', (): void => {
    let callback: (user: { uid: string } | null) => void;
    (onAuthStateChanged as import('vitest').Mock).mockImplementation((_auth: unknown, cb: unknown) => {
      callback = cb as (user: { uid: string } | null) => void;
      return (): void => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      callback(null);
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('done');
    expect(screen.getByTestId('user')).toHaveTextContent('null');
  });
});
