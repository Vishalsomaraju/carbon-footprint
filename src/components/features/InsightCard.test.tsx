/**
 * @module features/InsightCard.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { InsightCard } from './InsightCard';
import { InsightMessage } from '../../types';

describe('InsightCard', () => {
  it('renders transport insight', () => {
    const insight: InsightMessage = { id: '1', type: 'tip', title: 'transport Tip', body: 'Walk more', category: 'transport', generatedAt: Date.now() };
    render(<InsightCard insight={insight} />);
    
    expect(screen.getByText('🚗')).toBeInTheDocument();
    expect(screen.getByText('transport Tip')).toBeInTheDocument();
    expect(screen.getByText('Walk more')).toBeInTheDocument();
  });

  it('renders home energy insight', () => {
    const insight: InsightMessage = { id: '2', type: 'tip', title: 'home energy Tip', body: 'Turn off lights', category: 'home_energy', generatedAt: Date.now() };
    render(<InsightCard insight={insight} />);
    
    expect(screen.getByText('⚡')).toBeInTheDocument();
    expect(screen.getByText('Turn off lights')).toBeInTheDocument();
  });

  it('renders food insight', () => {
    const insight: InsightMessage = { id: '3', type: 'tip', title: 'food Tip', body: 'Eat less meat', category: 'food', generatedAt: Date.now() };
    render(<InsightCard insight={insight} />);
    
    expect(screen.getByText('🍽️')).toBeInTheDocument();
    expect(screen.getByText('Eat less meat')).toBeInTheDocument();
  });

  it('renders shopping insight', () => {
    const insight: InsightMessage = { id: '4', type: 'tip', title: 'shopping Tip', body: 'Buy second hand', category: 'shopping', generatedAt: Date.now() };
    render(<InsightCard insight={insight} />);
    
    expect(screen.getByText('🛍️')).toBeInTheDocument();
    expect(screen.getByText('Buy second hand')).toBeInTheDocument();
  });

  it('renders general insight', () => {
    const insight: InsightMessage = { id: '5', type: 'tip', title: 'general Tip', body: 'Save water', category: 'general', generatedAt: Date.now() };
    render(<InsightCard insight={insight} />);
    
    expect(screen.getByText('💡')).toBeInTheDocument();
    expect(screen.getByText('Save water')).toBeInTheDocument();
  });
});
