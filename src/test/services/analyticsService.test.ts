/**
 * @module services/analyticsService.test
 */

import { describe, it, expect, vi } from 'vitest';
import { logEvent as firebaseLogEvent } from 'firebase/analytics';

import { analyticsService } from '../../services/analyticsService';
import * as config from '../../lib/firebase';

vi.mock(
  'firebase/analytics',
  (): Record<string, unknown> => ({
    logEvent: vi.fn(),
  }),
);

vi.mock(
  '../../lib/firebase',
  (): Record<string, unknown> => ({
    analytics: {}, // Mock analytics object
  }),
);

describe('analyticsService', (): void => {
  it('should call firebaseLogEvent when analytics is initialized', (): void => {
    analyticsService.logEvent('test_event', { param: 'value' });
    expect(firebaseLogEvent).toHaveBeenCalledWith(config.analytics, 'test_event', {
      param: 'value',
    });
  });

  it('should not call firebaseLogEvent if analytics is null', (): void => {
    const originalAnalytics = config.analytics;
    Object.defineProperty(config, 'analytics', { value: null, writable: true });

    analyticsService.logEvent('test_event', { param: 'value' });

    expect(firebaseLogEvent).not.toHaveBeenCalledTimes(2);

    Object.defineProperty(config, 'analytics', { value: originalAnalytics, writable: true });
  });

  it('should call trackError', (): void => {
    const error = new Error('Test error');

    analyticsService.trackError(error, { extra: 'data' });

    expect(firebaseLogEvent).toHaveBeenCalledWith(config.analytics, 'error', {
      message: 'Test error',
      name: 'Error',
      extra: 'data',
    });
  });
});
