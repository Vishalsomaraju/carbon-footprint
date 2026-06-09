/**
 * @module LogActivityPage.test
 */

import { render, screen } from '@testing-library/react';
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
});
