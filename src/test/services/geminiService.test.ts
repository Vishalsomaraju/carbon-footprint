import { describe, it, expect, vi, beforeEach } from 'vitest';

import { generateWeeklyInsights, getReductionChat } from '../../services/geminiService';
import { ActivityRecord } from '../../types';

vi.mock('../../lib/env', () => ({
  env: {
    GEMINI_API_KEY: 'test-api-key',
  },
}));

vi.mock('../../utils/errorTracker', () => ({
  trackError: vi.fn(),
  trackEvent: vi.fn(),
}));

global.fetch = vi.fn();

describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateWeeklyInsights', () => {
    it('returns parsed insights on success', async () => {
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: '[{"title":"Test","body":"Test body","category":"transport","type":"tip"}]',
                },
              ],
            },
          },
        ],
      };

      (global.fetch as unknown as import("vitest").Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const activities: ActivityRecord[] = [
        {
          id: '1',
          userId: 'user1',
          category: 'transport',
          value: 10,
          carbonImpact: 5,
          date: new Date().toISOString(),
        },
      ];

      const result = await generateWeeklyInsights(activities);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test');
    });
  });

  describe('getReductionChat', () => {
    it('returns text response', async () => {
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: 'This is a chat response' }],
            },
          },
        ],
      };

      (global.fetch as unknown as import("vitest").Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await getReductionChat('hello', 'context');
      expect(response).toBe('This is a chat response');
    });
  });
});
