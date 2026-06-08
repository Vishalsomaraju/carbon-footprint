/**
 * @module features/FootprintChart.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { FootprintChart } from './FootprintChart';

// Mock recharts to avoid rendering issues in JSDOM
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />
}));

describe('FootprintChart', () => {
  it('renders empty state when no activities', () => {
    render(<FootprintChart activities={[]} />);
    expect(screen.getByText(/No data available yet/i)).toBeInTheDocument();
  });

  it('renders chart when activities are provided', () => {
    const activities = [
      { id: '1', category: 'transport', value: 10, carbonImpact: 2, date: '2023-01-01T12:00:00Z', userId: 'user1' }
    ];
    
    render(<FootprintChart activities={activities} />);
    
    expect(screen.getByText(/Carbon Footprint Trend/i)).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});
