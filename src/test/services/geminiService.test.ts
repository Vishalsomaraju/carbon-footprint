/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module services/geminiService.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { geminiService } from '../../services/geminiService';
import { env } from '../../lib/env';

vi.mock('../../lib/env', (): any => ({
  env: { GEMINI_API_KEY: 'test_key' },
}));

describe('geminiService', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    // Reset env before each test
    (env as any).GEMINI_API_KEY = 'test_key';
  });

  afterEach((): void => {
    vi.clearAllMocks();
  });

  it('should return mock insights if API key is missing', async (): Promise<void> => {
    (env as any).GEMINI_API_KEY = '';
    
    const activities: unknown[] = [];
    const insights = await geminiService.generateWeeklyInsights(activities);
    
    expect(insights).toHaveLength(2);
    expect(insights[0].category).toBe('food');
    expect(insights[1].category).toBe('transport');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should call Gemini API and return parsed insights', async (): Promise<void> => {
    const activities: unknown[] = [
      { id: '1', category: 'transport', value: 10, carbonImpact: 2.1, date: '2023-10-27', userId: 'user1' }
    ];

    const mockApiResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: '```json\n[\n  {\n    "category": "transport",\n    "type": "tip",\n    "title": "Drive less",\n    "body": "Use public transport."\n  }\n]\n```'
              }
            ]
          }
        }
      ]
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse
    });

    const insights = await geminiService.generateWeeklyInsights(activities);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(insights).toHaveLength(1);
    expect(insights[0].category).toBe('transport');
    expect(insights[0].body).toBe('Use public transport.');
    expect(insights[0].title).toBe('Drive less');
    expect(insights[0].type).toBe('tip');
  });

  it('should handle API errors gracefully', async (): Promise<void> => {
    const activities: unknown[] = [];
    
    (global.fetch as any).mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    });

    await expect(geminiService.generateWeeklyInsights(activities)).rejects.toThrow('Gemini API error: Internal Server Error');
  });
});
