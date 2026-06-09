import { describe, it, expect, vi } from 'vitest';

import { trackError, trackEvent } from '../../utils/errorTracker';

describe('errorTracker', () => {
  it('should track error instance', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('test error');

    trackError(error, 'testContext');

    expect(consoleErrorSpy).toHaveBeenCalledWith('[ErrorTracker] (testContext) test error', error);
    consoleErrorSpy.mockRestore();
  });

  it('should track non-error string', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = 'string error';

    trackError(error);

    expect(consoleErrorSpy).toHaveBeenCalledWith('[ErrorTracker] string error', error);
    consoleErrorSpy.mockRestore();
  });

  it('should track event', () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    trackEvent('test_event', { prop: 1 });

    expect(consoleLogSpy).toHaveBeenCalledWith('[Analytics] test_event', { prop: 1 });
    consoleLogSpy.mockRestore();
  });
});
