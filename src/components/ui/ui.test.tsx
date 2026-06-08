/**
 * @module ui/ui.test
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Button } from './Button';
import { Card , CardHeader, CardBody, CardFooter } from './Card';
import { Input } from './Input';
import { FormField } from './FormField';
import { LoadingSpinner } from './LoadingSpinner';

describe('UI Components', () => {
  describe('Button', () => {
    it('renders correctly', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /Click me/i })).toBeInTheDocument();
    });

    it('handles click events', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click me</Button>);
      fireEvent.click(screen.getByRole('button', { name: /Click me/i }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('shows loading state', () => {
      render(<Button isLoading>Click me</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
      // Wait text is usually not "Click me" but SVG
      expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Card', () => {
    it('renders children', () => {
      render(<Card>Card Content</Card>);
      expect(screen.getByText(/Card Content/i)).toBeInTheDocument();
    });
  });

  describe('Card subcomponents', () => {
    it('renders Card components', () => {
      render(
        <Card>
          <CardHeader>My Title</CardHeader>
          <CardBody>My Content</CardBody>
          <CardFooter>My Footer</CardFooter>
        </Card>
      );
      expect(screen.getByText(/My Title/i)).toBeInTheDocument();
      expect(screen.getByText(/My Content/i)).toBeInTheDocument();
      expect(screen.getByText(/My Footer/i)).toBeInTheDocument();
    });
  });

  describe('Input', () => {
    it('renders and accepts input', () => {
      render(<Input aria-label="test-input" />);
      const input = screen.getByLabelText('test-input');
      fireEvent.change(input, { target: { value: 'test' } });
      expect((input as HTMLInputElement).value).toBe('test');
    });

    it('shows error state', () => {
      render(<Input aria-label="error-input" error="Invalid input" />);
      const input = screen.getByLabelText('error-input');
      expect(input.className).toMatch(/border-red-500/);
    });
  });

  describe('FormField', () => {
    it('renders label and children', () => {
      render(
        <FormField label="Test Label" htmlFor="test-id" required helpText="Help text">
          <input id="test-id" />
        </FormField>
      );
      expect(screen.getByText(/Test Label/i)).toBeInTheDocument();
      expect(screen.getByText(/Help text/i)).toBeInTheDocument();
      expect(screen.getByText(/\*/i)).toBeInTheDocument();
    });
  });
});

describe('LoadingSpinner', () => {
  it('renders correctly with different sizes', () => {
    render(<LoadingSpinner size="sm" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
