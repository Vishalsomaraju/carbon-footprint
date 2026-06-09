/**
 * @module InsightsPage.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import { InsightsPage } from '../../pages/InsightsPage';
import { useInsights } from '../../hooks';

const mockSetChatMsg = vi.fn();
const mockFetchInsights = vi.fn();
const mockHandleRegenerate = vi.fn();
const mockHandleChat = vi.fn();

const defaultInsightsState = {
  insights: [],
  loading: false,
  error: '',
  chatMsg: '',
  setChatMsg: mockSetChatMsg,
  chatResp: '',
  chatLoading: false,
  activitiesCount: 0,
  fetchInsights: mockFetchInsights,
  handleRegenerate: mockHandleRegenerate,
  handleChat: mockHandleChat,
  lastGenTime: 0,
};

vi.mock('../../hooks', () => ({
  useInsights: vi.fn(),
  useActivities: vi.fn(),
}));

describe('InsightsPage', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks();
    vi.mocked(useInsights).mockReturnValue(defaultInsightsState);
  });

  it('renders insights successfully', async (): Promise<void> => {
    vi.mocked(useInsights).mockReturnValue({
      ...defaultInsightsState,
      activitiesCount: 1,
      insights: [
        {
          id: '1',
          title: 'Tip 1',
          body: 'Test body',
          type: 'tip',
          category: 'transport',
          generatedAt: Date.now(),
        },
        {
          id: '2',
          title: 'Tip 2',
          body: 'Test body',
          type: 'tip',
          category: 'food',
          generatedAt: Date.now(),
        },
      ],
    });

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>,
    );

    expect(screen.getByText('Tip 1')).toBeInTheDocument();
  });

  it('renders zero activities state', async (): Promise<void> => {
    vi.mocked(useInsights).mockReturnValue({ ...defaultInsightsState, activitiesCount: 0 });
    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>,
    );
    expect(screen.getByText(/Log some activities first/i)).toBeInTheDocument();
  });

  it('handles insights error state', async (): Promise<void> => {
    vi.mocked(useInsights).mockReturnValue({
      ...defaultInsightsState,
      activitiesCount: 1,
      error: 'Failed to load insights. Please try again later.',
    });
    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>,
    );
    expect(screen.getByText(/Failed to load insights/i)).toBeInTheDocument();
  });

  it('handles chat interaction successfully', async (): Promise<void> => {
    vi.mocked(useInsights).mockReturnValue({
      ...defaultInsightsState,
      activitiesCount: 1,
      chatResp: 'Chat response',
    });
    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>,
    );
    expect(screen.getByText('Chat response')).toBeInTheDocument();
  });

  it('handles chat interaction error', async (): Promise<void> => {
    vi.mocked(useInsights).mockReturnValue({
      ...defaultInsightsState,
      activitiesCount: 1,
      chatResp: 'Sorry, I encountered an error. Try again.',
    });
    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>,
    );
    expect(screen.getByText(/Sorry, I encountered an error/i)).toBeInTheDocument();
  });
});
