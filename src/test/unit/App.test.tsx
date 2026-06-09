import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { App } from '../../App';
import { useAuthContext } from '../../contexts/AuthContext';

vi.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuthContext: vi.fn()
}));

vi.mock('../../config', () => ({ auth: {}, db: {}, app: {}, googleProvider: {} }));

vi.mock('../../pages/LandingPage', () => ({
  LandingPage: () => <div data-testid="landing-page">Landing Page</div>
}));

vi.mock('../../pages/DashboardPage', () => ({
  DashboardPage: () => <div data-testid="dashboard-page">Dashboard Page</div>
}));

describe('App router', () => {
  beforeEach(() => {
    window.history.pushState({}, 'Test page', '/');
  });

  it('redirects to login when unauthenticated', () => {
    (useAuthContext as any).mockReturnValue({ user: null, loading: false });
    render(<App />);
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });

  it('renders dashboard when authenticated', () => {
    (useAuthContext as any).mockReturnValue({ user: { uid: '123' }, loading: false });
    window.history.pushState({}, 'Test', '/dashboard');
    render(<App />);
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });
});
