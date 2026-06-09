/**
 * @module LogActivityPage.test
 */

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import { LogActivityPage } from '../../pages/LogActivityPage';
import { useAuth, useActivities } from '../../hooks';

vi.mock(
  '../../hooks',
  (): Record<string, unknown> => ({
    useAuth: vi.fn(),
    useActivities: vi.fn(),
  }),
);

describe('LogActivityPage', (): void => {
  it('renders and interacts with form steps', async (): Promise<void> => {
    (useAuth as unknown as import('vitest').Mock).mockReturnValue({
      user: { displayName: 'John' },
    });
    const mockAddActivity = vi.fn().mockResolvedValue(true);
    (useActivities as unknown as import('vitest').Mock).mockReturnValue({
      activities: [],
      loading: false,
      addActivity: mockAddActivity,
    });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <LogActivityPage />
      </BrowserRouter>,
    );

    // Step 1: Category Selection
    expect(screen.getByText('Log Activity')).toBeInTheDocument();
    await user.click(screen.getByText('Transport'));

    // Step 2: Activity Form (Subtype & Value)
    expect(screen.getByText('Activity Type')).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText(/Activity Type/i), 'car_petrol');

    const valueInput = screen.getByLabelText(/Value/i);
    await user.clear(valueInput);
    await user.type(valueInput, '15');

    await user.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 3: Confirmation Step
    expect(await screen.findByText(/Estimated Impact/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Save Activity/i }));

    // Verify it called addActivity
    expect(mockAddActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'transport',
        subCategory: 'car_petrol',
        value: 15,
      }),
    );
  });

  it('handles submission errors', async (): Promise<void> => {
    (useAuth as unknown as import('vitest').Mock).mockReturnValue({
      user: { displayName: 'John' },
    });
    const mockAddActivity = vi.fn().mockRejectedValue(new Error('Firebase error'));
    (useActivities as unknown as import('vitest').Mock).mockReturnValue({
      activities: [],
      loading: false,
      addActivity: mockAddActivity,
    });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <LogActivityPage />
      </BrowserRouter>,
    );

    await user.click(screen.getByText('Transport'));
    await user.selectOptions(screen.getByLabelText(/Activity Type/i), 'car_petrol');

    const valueInput = screen.getByLabelText(/Value/i);
    await user.clear(valueInput);
    await user.type(valueInput, '15');

    await user.click(screen.getByRole('button', { name: /Continue/i }));

    const saveButton = await screen.findByRole('button', { name: /Save Activity/i });
    await user.click(saveButton);

    expect(await screen.findByText('Failed to save activity.')).toBeInTheDocument();
  });

  it('navigates back between steps and dismisses toast', async (): Promise<void> => {
    (useAuth as unknown as import('vitest').Mock).mockReturnValue({
      user: { displayName: 'John' },
    });
    const mockAddActivity = vi.fn().mockResolvedValue(true);
    (useActivities as unknown as import('vitest').Mock).mockReturnValue({
      activities: [],
      loading: false,
      addActivity: mockAddActivity,
    });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <LogActivityPage />
      </BrowserRouter>,
    );

    // Step 1 -> 2
    await user.click(screen.getByText('Transport'));
    expect(screen.getByText('Activity Type')).toBeInTheDocument();

    // Step 2 -> 1
    await user.click(screen.getByRole('button', { name: /Back/i }));
    expect(screen.getByText('Log Activity')).toBeInTheDocument();

    // Step 1 -> 2
    await user.click(screen.getByText('Transport'));
    await user.selectOptions(screen.getByLabelText(/Activity Type/i), 'car_petrol');
    const valueInput = screen.getByLabelText(/Value/i);
    await user.clear(valueInput);
    await user.type(valueInput, '15');

    // Step 2 -> 3
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    expect(await screen.findByText(/Estimated Impact/i)).toBeInTheDocument();

    // Step 3 -> 2
    await user.click(screen.getByRole('button', { name: /Back/i }));
    expect(screen.getByText('Activity Type')).toBeInTheDocument();

    // Form resets on mount, re-enter details
    await user.selectOptions(screen.getByLabelText(/Activity Type/i), 'car_petrol');
    const valueInput2 = screen.getByLabelText(/Value/i);
    await user.clear(valueInput2);
    await user.type(valueInput2, '15');

    // Step 2 -> 3
    await user.click(screen.getByRole('button', { name: /Continue/i }));

    // Save to trigger toast
    await user.click(screen.getByRole('button', { name: /Save Activity/i }));
    expect(await screen.findByText('Activity saved successfully!')).toBeInTheDocument();

    // Wait for toast and click dismiss
    await user.click(screen.getByRole('button', { name: '×' }));

    await waitFor(() => {
      expect(screen.queryByText('Activity saved successfully!')).not.toBeInTheDocument();
    });
  });
});
