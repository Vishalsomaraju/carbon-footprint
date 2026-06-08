/**
 * @module errorTracker
 * @description Centralized error tracking utility for all async catches.
 */

export const trackError = (error: unknown, context?: string): void => {
  // In a real production app this would ping Sentry/Datadog etc.
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`[ErrorTracker] ${context ? `(${context}) ` : ''}${errorMessage}`, error);
};
