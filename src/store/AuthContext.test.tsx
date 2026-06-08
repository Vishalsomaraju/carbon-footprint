/**
 * @module store/AuthContext.test
 */

import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { onAuthStateChanged } from 'firebase/auth';

import { AuthProvider, useAuthContext } from './AuthContext';

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  getAuth: vi.fn()
}));

vi.mock('../config', () => ({
  auth: {}
}));

const TestComponent = () => {
  const { user, loading } = useAuthContext();
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'done'}</div>
      <div data-testid="user">{user ? user.uid : 'null'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  it('should initialize with loading true and handle auth state change', () => {
    let callback: any;
    (onAuthStateChanged as any).mockImplementation((_auth: any, cb: any) => {
      callback = cb;
      return () => {}; // unsubscribe fn
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

  it('should handle unauthenticated state', () => {
    let callback: any;
    (onAuthStateChanged as any).mockImplementation((_auth: any, cb: any) => {
      callback = cb;
      return () => {};
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
