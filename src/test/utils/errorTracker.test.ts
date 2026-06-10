import { describe, it } from 'vitest';

import { trackError, trackEvent } from '../../utils/errorTracker';

describe('errorTracker', () => {
  it('should track error instance', () => {
    const error = new Error('test error');

    trackError(error, 'testContext');
  });

  it('should track non-error string', () => {
    const error = 'string error';

    trackError(error);
  });

  it('should track event', () => {
    trackEvent('test_event', { prop: 1 });
  });
});
