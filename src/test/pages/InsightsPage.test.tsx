
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { InsightsPage } from '../../pages/InsightsPage';
import { useActivities } from '../../hooks';
import * as geminiService from '../../services/geminiService';

vi.mock('../../hooks', () => ({
  useActivities: vi.fn(),
}));
vi.mock('../../services/geminiService', () => ({
  generateWeeklyInsights: vi.fn(),
  getReductionChat: vi.fn(),
}));

describe('InsightsPage', () => {
  it('renders insights successfully', async () => {
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ activities: [{ id: '1', carbonImpact: 10, category: 'transport', date: new Date().toISOString() }], loading: false });
    (geminiService.generateWeeklyInsights as import("vitest").Mock).mockResolvedValue([
      { id: '1', title: 'Tip 1', body: 'Test body', type: 'tip', category: 'transport' },
      { id: '2', title: 'Tip 2', body: 'Test body', type: 'tip', category: 'food' },
      { id: '3', title: 'Tip 3', body: 'Test body', type: 'tip', category: 'energy' },
      { id: '4', title: 'Tip 4', body: 'Test body', type: 'tip', category: 'shopping' },
      { id: '5', title: 'Tip 5', body: 'Test body', type: 'tip', category: 'unknown' }
    ]);

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText('Tip 1')).toBeInTheDocument());
  });

  it('renders zero activities state', async () => {
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ activities: [], loading: false });
    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );
    expect(await screen.findByText(/Log some activities first/i)).toBeInTheDocument();
  });

  it('handles insights error state', async () => {
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ activities: [{ id: '1' }], loading: false });
    (geminiService.generateWeeklyInsights as import("vitest").Mock).mockRejectedValue(new Error('AI Error'));
    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );
    expect(await screen.findByText(/Failed to load insights/i)).toBeInTheDocument();
  });

  it('handles chat interaction successfully', async () => {
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ activities: [{ id: '1' }], loading: false });
    (geminiService.generateWeeklyInsights as import("vitest").Mock).mockResolvedValue([]);
    (geminiService.getReductionChat as import("vitest").Mock).mockResolvedValue('Chat response');

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );
    
    await user.type(screen.getByPlaceholderText(/Ask about reducing/i), 'Hello');
    await user.click(screen.getByRole('button', { name: /Send/i }));

    expect(await screen.findByText('Chat response')).toBeInTheDocument();
  });

  it('handles chat interaction error', async () => {
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ activities: [{ id: '1' }], loading: false });
    (geminiService.generateWeeklyInsights as import("vitest").Mock).mockResolvedValue([]);
    (geminiService.getReductionChat as import("vitest").Mock).mockRejectedValue(new Error('Chat Error'));

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );
    
    await user.type(screen.getByPlaceholderText(/Ask about reducing/i), 'Hello');
    await user.click(screen.getByRole('button', { name: /Send/i }));

    expect(await screen.findByText(/Sorry, I encountered an error/i)).toBeInTheDocument();
  });
});
