/**
 * @module pages/AuthPage.test
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useNavigate } from 'react-router-dom';

import { AuthPage } from './AuthPage';
import { useAuth } from '../hooks';

vi.mock('../hooks', () => ({
  useAuth: vi.fn()
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}));

vi.mock('../components/ui', () => ({
  Button: ({ children, onClick, isLoading }: any) => (
    <button onClick={onClick} disabled={isLoading} data-testid="login-button">
      {isLoading ? 'Loading...' : children}
    </button>
  ),
  Card: ({ children }: any) => <div>{children}</div>,
  GoogleIcon: () => <span>GoogleIcon</span>
}));

describe('AuthPage', () => {
  it('renders correctly and handles login', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ uid: '123' });
    const mockNavigate = vi.fn();
    
    (useAuth as any).mockReturnValue({ login: mockLogin, loading: false, error: null });
    (useNavigate as any).mockReturnValue(mockNavigate);

    render(<AuthPage />);

    expect(screen.getByText(/Welcome to EcoTrack/i)).toBeInTheDocument();
    
    const loginButton = screen.getByTestId('login-button');
    
    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(mockLogin).toHaveBeenCalled();
    
    // Simulate auth state updating after login
    (useAuth as any).mockReturnValue({ login: mockLogin, user: { uid: '123' }, loading: false, error: null });
    render(<AuthPage />);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows error if login fails', async () => {
    const mockLogin = vi.fn().mockRejectedValue(new Error('Failed to sign in'));
    (useAuth as any).mockReturnValue({ login: mockLogin, loading: false, error: new Error('Failed to sign in') });
    (useNavigate as any).mockReturnValue(vi.fn());

    render(<AuthPage />);
    
    expect(screen.getByText(/Failed to sign in/i)).toBeInTheDocument();
  });
});
