/**
 * @module ErrorBoundary.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { ErrorBoundary } from '../../components/ui/ErrorBoundary';

const ThrowError = (): never => {
  throw new Error('Test error');
};

describe('ErrorBoundary', (): void => {
  it('renders children when no error', (): void => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('renders fallback UI when error occurs', (): void => {
    // Suppress console.error in tests
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    
    spy.mockRestore();
  });

  it('renders custom fallback when provided', (): void => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    
    spy.mockRestore();
  });
});
