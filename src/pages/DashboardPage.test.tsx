/**
 * @module pages/DashboardPage.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import { DashboardPage } from './DashboardPage';
import { useAuth, useActivities, useGeminiInsights } from '../hooks';

vi.mock('../hooks', () => ({
  useAuth: vi.fn(),
  useActivities: vi.fn(),
  useGeminiInsights: vi.fn()
}));

vi.mock('../components/features', () => ({
  ActivityForm: () => <div data-testid="activity-form">ActivityForm</div>,
  FootprintChart: () => <div data-testid="footprint-chart">FootprintChart</div>,
  InsightCard: ({ insight }: any) => <div data-testid="insight-card">{insight.body}</div>
}));

vi.mock('../components/ui', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>
}));

describe('DashboardPage', () => {
  it('renders loading state initially', () => {
    (useAuth as any).mockReturnValue({ user: { displayName: 'John' } });
    (useActivities as any).mockReturnValue({ activities: [], loading: true, addActivity: vi.fn() });
    (useGeminiInsights as any).mockReturnValue({ insights: [], loading: false, generateInsights: vi.fn() });

    render(<DashboardPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders insights when they are available', () => {
    (useAuth as any).mockReturnValue({ user: { displayName: 'John' } });
    (useActivities as any).mockReturnValue({
      activities: [],
      loading: false,
      error: null,
      addActivity: vi.fn(),
      deleteActivity: vi.fn(),
    });

    (useGeminiInsights as any).mockReturnValue({ 
      insights: [{ id: '1', type: 'tip', title: 'Good', body: 'Great job!', category: 'general' }], 
      loading: false, 
      generateInsights: vi.fn() 
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('insight-card')).toHaveTextContent('Great job!');
  });

  it('renders dashboard content', () => {
    (useAuth as any).mockReturnValue({ user: { displayName: 'John' } });
    (useActivities as any).mockReturnValue({ 
      activities: [{ id: '1', category: 'transport', value: 10, carbonImpact: 2, date: '2023-01-01', userId: 'user1' }], 
      loading: false, 
      addActivity: vi.fn() 
    });
    (useGeminiInsights as any).mockReturnValue({ 
      insights: [{ id: '1', type: 'tip', title: 'Good', body: 'Great job!', category: 'general' }], 
      loading: false, 
      generateInsights: vi.fn() 
    });

    render(<DashboardPage />);
    
    expect(screen.getByText('Welcome, John!')).toBeInTheDocument();
    expect(screen.getByTestId('activity-form')).toBeInTheDocument();
    expect(screen.getByTestId('footprint-chart')).toBeInTheDocument();
    expect(screen.getByTestId('insight-card')).toHaveTextContent('Great job!');
  });
});
