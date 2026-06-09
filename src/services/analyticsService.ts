/**
 * @module services/analyticsService
 */

import { logEvent as firebaseLogEvent } from 'firebase/analytics';

import { analytics } from '../config';

export const trackEvent = (eventName: string, eventParams?: Record<string, unknown>): void => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, eventParams);
  } else {
    console.log(`[Analytics Mock] ${eventName}`, eventParams);
  }
};

export const trackError = (error: Error, context?: Record<string, unknown>): void => {
  trackEvent('error', {
    message: error.message,
    name: error.name,
    ...context
  });
  console.error('[ErrorTracker]', error, context);
};

export const analyticsService = {
  logEvent: trackEvent,
  trackError
};
