/**
 * @module services/analyticsService
 */

import { logEvent as firebaseLogEvent } from 'firebase/analytics';

import { analytics } from '../lib/firebase';

export const trackEvent = (eventName: string, eventParams?: Record<string, unknown>): void => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, eventParams);
  } else {
    // Analytics mock handled here
  }
};

export const trackError = (error: Error, context?: Record<string, unknown>): void => {
  trackEvent('error', {
    message: error.message,
    name: error.name,
    ...context,
  });
};

export const analyticsService = {
  logEvent: trackEvent,
  trackError,
};
