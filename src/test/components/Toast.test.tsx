/**
 * @module Toast.test
 */

import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Toast } from '../../components/ui/Toast';

describe('Toast', (): void => {
  beforeEach((): void => {
    vi.useFakeTimers();
  });

  afterEach((): void => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders success message and dismisses after timeout', (): void => {
    const onDismiss = vi.fn();
    render(<Toast message="Success!" type="success" onDismiss={onDismiss} />);

    expect(screen.getByText('Success!')).toBeInTheDocument();

    // Advance 3000ms
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Success!')).not.toBeInTheDocument();

    // Advance 300ms for animation
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onDismiss).toHaveBeenCalled();
  });

  it('renders error message and can be dismissed manually', (): void => {
    const onDismiss = vi.fn();
    render(<Toast message="Error!" type="error" onDismiss={onDismiss} />);

    expect(screen.getByText('Error!')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));

    expect(screen.queryByText('Error!')).not.toBeInTheDocument();
  });
});
