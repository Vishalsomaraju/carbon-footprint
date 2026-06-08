/**
 * @module services/geminiService.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { geminiService } from './geminiService';
import { env } from '../lib/env';

vi.mock('../lib/env', () => ({
  env: { GEMINI_API_KEY: 'test_key' },
}));

describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    // Reset env before each test
    (env as any).GEMINI_API_KEY = 'test_key';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return mock insights if API key is missing', async () => {
    (env as any).GEMINI_API_KEY = '';
    
    const activities: any[] = [];
    const insights = await geminiService.generateInsights(activities);
    
    expect(insights).toHaveLength(2);
    expect(insights[0].category).toBe('general');
    expect(insights[1].category).toBe('transport');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should call Gemini API and return parsed insights', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: '```json\n[{"category": "transport", "text": "Drive less"}]\n```'
              }
            ]
          }
        }
      ]
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    const activities: any[] = [{ id: '1', category: 'transport', value: 10 }];
    const insights = await geminiService.generateInsights(activities);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(insights).toHaveLength(1);
    expect(insights[0].category).toBe('transport');
    expect(insights[0].text).toBe('Drive less');
    expect(insights[0].id).toBe('insight-0');
  });

  it('should handle API errors', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error'
    });

    const activities: any[] = [];
    
    await expect(geminiService.generateInsights(activities)).rejects.toThrow('Gemini API error: Internal Server Error');
  });
});
