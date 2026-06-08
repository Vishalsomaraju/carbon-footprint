/**
 * @module src/App.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { App } from './App';
import { useAuthContext } from './store/AuthContext';

vi.mock('./store/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuthContext: vi.fn()
}));

vi.mock('./config', () => ({
  auth: {},
  db: {},
  app: {},
  googleProvider: {}
}));

vi.mock('./pages/AuthPage', () => ({
  AuthPage: () => <div data-testid="auth-page">Auth Page</div>
}));

vi.mock('./pages/DashboardPage', () => ({
  DashboardPage: () => <div data-testid="dashboard-page">Dashboard Page</div>
}));

vi.mock('./pages/SettingsPage', () => ({
  SettingsPage: () => <div data-testid="settings-page">Settings Page</div>
}));

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, 'Test page', '/');
  });

  it('renders loading state for protected route', () => {
    (useAuthContext as any).mockReturnValue({ user: null, loading: true });
    render(<App />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // LoadingSpinner
  });

  it('redirects to login when unauthenticated', () => {
    (useAuthContext as any).mockReturnValue({ user: null, loading: false });
    render(<App />);
    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
  });

  it('renders dashboard when authenticated', () => {
    (useAuthContext as any).mockReturnValue({ user: { uid: '123' }, loading: false });
    render(<App />);
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });
});
