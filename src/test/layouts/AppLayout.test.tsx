/**
 * @module layouts/AppLayout.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { AppLayout } from '../../layouts/AppLayout';

vi.mock('../../hooks', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useLocation: (): { pathname: string } => ({ pathname: '/' }),
    Outlet: (): null => null,
  };
});

describe('AppLayout', (): void => {
  it('renders layout and navigation items', (): void => {
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>,
    );

    // Look for both desktop and mobile instances
    const brandElements = screen.getAllByText('CarbonWise');
    expect(brandElements.length).toBeGreaterThan(0);

    // Check for some nav links
    const dashboardLinks = screen.getAllByText('Dashboard');
    expect(dashboardLinks.length).toBeGreaterThan(0);
  });
});
