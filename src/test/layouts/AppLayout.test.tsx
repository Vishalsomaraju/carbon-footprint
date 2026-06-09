/**
 * @module layouts/AppLayout.test
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { AppLayout } from '../../layouts/AppLayout';
import { useAuth } from '../../hooks';

vi.mock('../../hooks', (): Record<string, unknown> => ({
  useAuth: vi.fn()
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as import('vitest').Mock,
    useNavigate: (): import('vitest').Mock => mockNavigate,
    useLocation: (): import("react").ReactElement => ({ pathname: '/' })
  };
});

describe('AppLayout', (): void => {
  it('renders layout without user', (): void => {
    (useAuth as import('vitest').Mock).mockReturnValue({ user: null, logout: vi.fn() });

    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    );

    expect(screen.getByText('EcoTrack')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('renders layout with user and handles logout', async (): Promise<void> => {
    const mockLogout = vi.fn().mockResolvedValue(true);
    (useAuth as import('vitest').Mock).mockReturnValue({ user: { displayName: 'John' }, logout: mockLogout });

    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    );

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    const logoutBtn = screen.getByText('Logout');
    
    await act(async () => {
      fireEvent.click(logoutBtn);
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
