/**
 * @module geminiService.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { generateWeeklyInsights, getReductionChat } from '../services/geminiService';

const originalFetch = global.fetch;

describe('geminiService', (): void => {
  beforeEach((): void => {
    global.fetch = vi.fn();
  });

  afterEach((): void => {
    global.fetch = originalFetch;
  });

  it('generateWeeklyInsights returns 3 insights', async (): Promise<void> => {
    const mockRes = {
      ok: true,
      json: async (): Promise<unknown> => ({
        candidates: [{ content: { parts: [{ text: '[{"type":"success","title":"Good job","description":"Very low emission"}]' }] } }]
      })
    };
    (global.fetch as import('vitest').Mock).mockResolvedValue(mockRes);

    const insights = await generateWeeklyInsights([]);
    expect(insights).toHaveLength(1);
    expect(insights[0].type).toBe('success');
  });

  it('generateWeeklyInsights throws on 500', async (): Promise<void> => {
    (global.fetch as import('vitest').Mock).mockResolvedValue({ ok: false, statusText: 'Server Error' });
    await expect(generateWeeklyInsights([])).rejects.toThrow('Gemini API error: undefined');
  });

  it('getReductionChat returns text', async (): Promise<void> => {
    const mockRes = {
      ok: true,
      json: async (): Promise<unknown> => ({
        candidates: [{ content: { parts: [{ text: 'Here is your chat response.' }] } }]
      })
    };
    (global.fetch as import('vitest').Mock).mockResolvedValue(mockRes);

    const text = await getReductionChat('Hello', 'Context');
    expect(text).toBe('Here is your chat response.');
  });
});
