/**
 * @module features/InsightCard.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { InsightCard } from './InsightCard';
import { Insight } from '../../types';

describe('InsightCard', () => {
  it('renders transport insight', () => {
    const insight: Insight = { id: '1', category: 'transport', text: 'Walk more' };
    render(<InsightCard insight={insight} />);
    expect(screen.getByText('🚗')).toBeInTheDocument();
    expect(screen.getByText('transport Tip')).toBeInTheDocument();
    expect(screen.getByText('Walk more')).toBeInTheDocument();
  });

  it('renders home energy insight', () => {
    const insight: Insight = { id: '2', category: 'home_energy', text: 'Turn off lights' };
    render(<InsightCard insight={insight} />);
    expect(screen.getByText('⚡')).toBeInTheDocument();
    expect(screen.getByText('home energy Tip')).toBeInTheDocument();
  });

  it('renders food insight', () => {
    const insight: Insight = { id: '3', category: 'food', text: 'Eat less meat' };
    render(<InsightCard insight={insight} />);
    expect(screen.getByText('🍽️')).toBeInTheDocument();
  });

  it('renders shopping insight', () => {
    const insight: Insight = { id: '4', category: 'shopping', text: 'Buy local' };
    render(<InsightCard insight={insight} />);
    expect(screen.getByText('🛍️')).toBeInTheDocument();
  });

  it('renders general insight', () => {
    const insight: Insight = { id: '5', category: 'general', text: 'General tip' };
    render(<InsightCard insight={insight} />);
    expect(screen.getByText('💡')).toBeInTheDocument();
    expect(screen.getByText('general Tip')).toBeInTheDocument();
  });
});
