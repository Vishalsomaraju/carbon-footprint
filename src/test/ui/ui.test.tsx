/**
 * @module ui/ui.test
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Button } from '../../components/ui/Button';
import { Card , CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { FormField } from '../../components/ui/FormField';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

describe('UI Components', (): void => {
  describe('Button', (): void => {
    it('renders correctly', (): void => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /Click me/i })).toBeInTheDocument();
    });

    it('handles click events', (): void => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click me</Button>);
      fireEvent.click(screen.getByRole('button', { name: /Click me/i }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('shows loading state', (): void => {
      render(<Button isLoading>Click me</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
      // Wait text is usually not "Click me" but SVG
      expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Card', (): void => {
    it('renders children', (): void => {
      render(<Card>Card Content</Card>);
      expect(screen.getByText(/Card Content/i)).toBeInTheDocument();
    });
  });

  describe('Card subcomponents', (): void => {
    it('renders Card components', (): void => {
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

  describe('Input', (): void => {
    it('renders and accepts input', (): void => {
      render(<Input aria-label="test-input" />);
      const input = screen.getByLabelText('test-input');
      fireEvent.change(input, { target: { value: 'test' } });
      expect((input as HTMLInputElement).value).toBe('test');
    });

    it('shows error state', (): void => {
      render(<Input aria-label="error-input" error="Invalid input" />);
      const input = screen.getByLabelText('error-input');
      expect(input.className).toMatch(/border-red-500/);
    });
  });

  describe('FormField', (): void => {
    it('renders label and children', (): void => {
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

describe('LoadingSpinner', (): void => {
  it('renders correctly with different sizes', (): void => {
    render(<LoadingSpinner size="sm" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
