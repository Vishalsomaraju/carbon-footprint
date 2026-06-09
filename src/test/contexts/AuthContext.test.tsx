/**
 * @module AuthContext.test
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { AuthProvider, useAuthContext } from '../../contexts/AuthContext';

vi.mock(
  'firebase/auth',
  (): Record<string, unknown> => ({
    getAuth: vi.fn(() => ({})),
    getRedirectResult: vi.fn().mockResolvedValue(null),
    onAuthStateChanged: vi.fn((_auth, cb) => {
      cb({ uid: '123' });
      return () => {};
    }),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    browserLocalPersistence: {},
    setPersistence: vi.fn().mockResolvedValue(undefined),
  }),
);
vi.mock('../../lib/firebase', (): Record<string, unknown> => ({ auth: {}, googleProvider: {} }));

const TestComponent = (): import('react').ReactElement => {
  const { user } = useAuthContext();
  return <div data-testid="user">{user ? user.uid : 'null'}</div>;
};

const ThrowComponent = (): import('react').ReactElement => {
  useAuthContext();
  return <div>Should throw</div>;
};

describe('AuthContext', (): void => {
  it('renders children when loaded', (): void => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );
    expect(screen.getByTestId('user')).toHaveTextContent('123');
  });

  it('useAuth provides null user outside provider', (): void => {
    render(<ThrowComponent />);
    expect(screen.getByText('Should throw')).toBeInTheDocument();
  });
});
