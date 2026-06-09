/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module layouts/AppLayout.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { AppLayout } from '../../layouts/AppLayout';

vi.mock('../../hooks', (): any => ({
  useAuth: vi.fn()
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useLocation: (): any => ({ pathname: '/' })
  };
});

describe('AppLayout', (): void => {
  it('renders layout and navigation items', (): void => {
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    );

    // Look for both desktop and mobile instances
    const brandElements = screen.getAllByText('CarbonWise');
    expect(brandElements.length).toBeGreaterThan(0);
    
    // Check for some nav links
    const dashboardLinks = screen.getAllByText('Dashboard');
    expect(dashboardLinks.length).toBeGreaterThan(0);
  });
});
