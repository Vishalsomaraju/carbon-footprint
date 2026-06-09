import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateWeeklyInsights, getReductionChat } from '../services/geminiService';

const originalFetch = global.fetch;

describe('geminiService', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('generateWeeklyInsights returns 3 insights', async () => {
    const mockRes = {
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '[{"type":"success","title":"Good job","description":"Very low emission"}]' }] } }]
      })
    };
    (global.fetch as any).mockResolvedValue(mockRes);

    const insights = await generateWeeklyInsights([]);
    expect(insights).toHaveLength(1);
    expect(insights[0].type).toBe('success');
  });

  it('generateWeeklyInsights throws on 500', async () => {
    (global.fetch as any).mockResolvedValue({ ok: false, statusText: 'Server Error' });
    await expect(generateWeeklyInsights([])).rejects.toThrow('Gemini API error: undefined');
  });

  it('getReductionChat returns text', async () => {
    const mockRes = {
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Here is your chat response.' }] } }]
      })
    };
    (global.fetch as any).mockResolvedValue(mockRes);

    const text = await getReductionChat('Hello');
    expect(text).toBe('Here is your chat response.');
  });
});
