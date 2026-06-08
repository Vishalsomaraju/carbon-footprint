/**
 * @module features/ActivityForm.test
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { ActivityForm } from './ActivityForm';

describe('ActivityForm', () => {
  it('renders correctly', () => {
    render(<ActivityForm onSubmit={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /Log Activity/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
  });

  it('shows error if value is missing', async () => {
    const mockSubmit = vi.fn();
    render(<ActivityForm onSubmit={mockSubmit} />);
    
    const submitBtn = screen.getByRole('button', { name: /Log Activity/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Please enter a valid number/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with correct data', async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ActivityForm onSubmit={mockSubmit} />);
    
    const categorySelect = screen.getByLabelText(/Category/i);
    const valueInput = screen.getByLabelText(/Value/i);
    const descInput = screen.getByLabelText(/Description/i);
    
    fireEvent.change(categorySelect, { target: { value: 'food' } });
    fireEvent.change(valueInput, { target: { value: '2' } });
    fireEvent.change(descInput, { target: { value: 'Ate a burger' } });
    
    const submitBtn = screen.getByRole('button', { name: /Log Activity/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
        category: 'food',
        value: 2,
        description: 'Ate a burger'
      }));
    });
    
    // Inputs should be cleared
    expect((valueInput as HTMLInputElement).value).toBe('');
    expect((descInput as HTMLInputElement).value).toBe('');
  });

  it('handles onSubmit error', async () => {
    const mockSubmit = vi.fn().mockRejectedValue(new Error('Failed'));
    render(<ActivityForm onSubmit={mockSubmit} />);
    
    const valueInput = screen.getByLabelText(/Value/i);
    fireEvent.change(valueInput, { target: { value: '10' } });
    
    const submitBtn = screen.getByRole('button', { name: /Log Activity/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Failed to log activity/i)).toBeInTheDocument();
  });
});
