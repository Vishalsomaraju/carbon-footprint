/**
 * @module services/analyticsService.test
 */

import { describe, it, expect, vi } from 'vitest';
import { logEvent as firebaseLogEvent } from 'firebase/analytics';

import { analyticsService } from './analyticsService';
import * as config from '../config';

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn()
}));

vi.mock('../config', () => ({
  analytics: {} // Mock analytics object
}));

describe('analyticsService', () => {
  it('should call firebaseLogEvent when analytics is initialized', () => {
    analyticsService.logEvent('test_event', { param: 'value' });
    expect(firebaseLogEvent).toHaveBeenCalledWith(config.analytics, 'test_event', { param: 'value' });
  });

  it('should log to console if analytics is null', () => {
    // Override the mock for this specific test
    // To do this we can redefine the property
    const originalAnalytics = config.analytics;
    Object.defineProperty(config, 'analytics', { value: null, writable: true });
    
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    analyticsService.logEvent('test_event', { param: 'value' });
    
    expect(consoleSpy).toHaveBeenCalledWith('[Analytics Mock] test_event', { param: 'value' });
    expect(firebaseLogEvent).not.toHaveBeenCalledTimes(2); // Since we called it once in the previous test
    
    consoleSpy.mockRestore();
    // Restore
    Object.defineProperty(config, 'analytics', { value: originalAnalytics, writable: true });
  });
});
