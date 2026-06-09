/**
 * @module utils/errorTracker
 * @description Shared error and event tracking.
 */
export const trackError = (error: unknown, context?: string): void => {
  const msg = error instanceof Error ? error.message : String(error);
  console.error(`[ErrorTracker] ${context ? `(${context}) ` : ''}${msg}`, error);
};

export const trackEvent = (eventName: string, properties?: Record<string, unknown>): void => {
  console.log(`[Analytics] ${eventName}`, properties);
};
