/**
 * @module services/analyticsService
 */

import { logEvent as firebaseLogEvent } from 'firebase/analytics';

import { analytics } from '../config';

export const analyticsService = {
  logEvent: (eventName: string, eventParams?: Record<string, any>) => {
    if (analytics) {
      firebaseLogEvent(analytics, eventName, eventParams);
    } else {
      console.log(`[Analytics Mock] ${eventName}`, eventParams);
    }
  }
};
