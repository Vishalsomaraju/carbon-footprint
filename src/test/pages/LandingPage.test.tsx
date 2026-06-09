/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module pages/LandingPage.test
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useNavigate } from 'react-router-dom';

import { LandingPage } from '../../pages/LandingPage';
import { useAuth } from '../../hooks';

vi.mock('../../hooks', (): any => ({
  useAuth: vi.fn()
}));

vi.mock('react-router-dom', (): any => ({
  useNavigate: vi.fn()
}));

vi.mock('../../components/ui', (): any => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid="login-button">
      {children}
    </button>
  ),
  GoogleIcon: () => <span>GoogleIcon</span>
}));

describe('LandingPage', (): void => {
  it('renders correctly and handles login', async (): Promise<void> => {
    const mockLogin = vi.fn().mockResolvedValue({ uid: '123' });
    const mockNavigate = vi.fn();
    
    (useAuth as any).mockReturnValue({ login: mockLogin, loading: false, error: null });
    (useNavigate as any).mockReturnValue(mockNavigate);

    render(<LandingPage />);

    expect(screen.getByText(/Understand your impact/i)).toBeInTheDocument();
    
    const loginButton = screen.getByTestId('login-button');
    
    await act(async () => {
      fireEvent.click(loginButton);
    });

    expect(mockLogin).toHaveBeenCalled();
    
    // Simulate auth state updating after login
    (useAuth as any).mockReturnValue({ login: mockLogin, user: { uid: '123' }, loading: false, error: null });
    render(<LandingPage />);
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
