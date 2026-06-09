import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuthContext } from '../../contexts/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn((auth, cb) => {
    cb({ uid: '123' });
    return () => {};
  }),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn()
}));
vi.mock('../../config', () => ({ auth: {}, googleProvider: {} }));

const TestComponent = () => {
  const { user } = useAuthContext();
  return <div data-testid="user">{user ? user.uid : 'null'}</div>;
};

const ThrowComponent = () => {
  useAuthContext();
  return <div>Should throw</div>;
};

describe('AuthContext', () => {
  it('renders children when loaded', () => {
    render(<AuthProvider><TestComponent /></AuthProvider>);
    expect(screen.getByTestId('user')).toHaveTextContent('123');
  });

  it('useAuth provides null user outside provider', () => {
    render(<ThrowComponent />);
    expect(screen.getByText('Should throw')).toBeInTheDocument();
  });
});
