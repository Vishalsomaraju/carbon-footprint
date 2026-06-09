/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module features/FootprintChart.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { FootprintChart } from '../../components/features/FootprintChart';

// Mock recharts to avoid rendering issues in JSDOM
vi.mock('recharts', (): any => ({
  ResponsiveContainer: ({ children }: { children?: import('react').ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children?: import('react').ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: (): any => <div data-testid="bar" />,
  XAxis: (): any => <div />,
  YAxis: (): any => <div />,
  CartesianGrid: (): any => <div />,
  Tooltip: (): any => <div />,
  Legend: (): any => <div />
}));

describe('FootprintChart', (): void => {
  it('renders empty state when no activities', (): void => {
    render(<FootprintChart activities={[]} />);
    expect(screen.getByText(/No data available yet/i)).toBeInTheDocument();
  });

  it('renders chart when activities are provided', (): void => {
    const activities = [
      { id: '1', category: 'transport', value: 10, carbonImpact: 2, date: '2023-01-01T12:00:00Z', userId: 'user1' }
    ];
    
    render(<FootprintChart activities={activities} />);
    
    expect(screen.getByText(/Carbon Footprint Trend/i)).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});
