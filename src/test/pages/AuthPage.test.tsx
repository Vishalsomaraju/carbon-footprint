/**
 * @module pages/AuthPage.test
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useNavigate } from 'react-router-dom';

import { AuthPage } from '../../pages/AuthPage';
import { useAuth } from '../../hooks';

vi.mock('../../hooks', (): Record<string, unknown> => ({
  useAuth: vi.fn()
}));

vi.mock('react-router-dom', (): Record<string, unknown> => ({
  useNavigate: vi.fn()
}));

vi.mock('../../components/ui', (): Record<string, unknown> => ({
  Button: ({ children, onClick, isLoading }: unknown) => (
    <button onClick={onClick} disabled={isLoading} data-testid="login-button">
      {isLoading ? 'Loading...' : children}
    </button>
  ),
  Card: ({ children }: unknown) => <div>{children}</div>,
  GoogleIcon: () => <span>GoogleIcon</span>
}));

describe('AuthPage', (): void => {
  it('renders correctly and handles login', async (): Promise<void> => {
    const mockLogin = vi.fn().mockResolvedValue({ uid: '123' });
    const mockNavigate = vi.fn();
    
    (useAuth as import('vitest').Mock).mockReturnValue({ login: mockLogin, loading: false, error: null });
    (useNavigate as import('vitest').Mock).mockReturnValue(mockNavigate);

    render(<AuthPage />);

    expect(screen.getByText(/Welcome to EcoTrack/i)).toBeInTheDocument();
    
    const loginButton = screen.getByTestId('login-button');
    
    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(mockLogin).toHaveBeenCalled();
    
    // Simulate auth state updating after login
    (useAuth as import('vitest').Mock).mockReturnValue({ login: mockLogin, user: { uid: '123' }, loading: false, error: null });
    render(<AuthPage />);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows error if login fails', async (): Promise<void> => {
    const mockLogin = vi.fn().mockRejectedValue(new Error('Failed to sign in'));
    (useAuth as import('vitest').Mock).mockReturnValue({ login: mockLogin, loading: false, error: new Error('Failed to sign in') });
    (useNavigate as import('vitest').Mock).mockReturnValue(vi.fn());

    render(<AuthPage />);
    
    expect(screen.getByText(/Failed to sign in/i)).toBeInTheDocument();
  });
});
