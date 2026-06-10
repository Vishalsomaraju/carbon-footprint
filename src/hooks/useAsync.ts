/**
 * @module hooks/useAsync
 */

import { useState, useCallback } from 'react';

import { trackError } from '../utils';

type AsyncFunction<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

/**
 * A custom hook to handle asynchronous operations.
 * Manages loading, data, and error states automatically, and integrates with the error tracking system.
 *
 * @template T The expected return type of the asynchronous function.
 * @template Args The types of the arguments expected by the asynchronous function.
 * @param {AsyncFunction<T, Args>} asyncFunction The asynchronous function to execute.
 * @returns An object containing the execution trigger, loading state, error state, and the resulting data.
 */
export function useAsync<T, Args extends unknown[]>(
  asyncFunction: AsyncFunction<T, Args>,
): {
  execute: (...args: Args) => Promise<T>;
  data: T | null;
  loading: boolean;
  error: Error | null;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: Args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (err: unknown) {
        trackError(err);
        setError(err as Error);
        // Always re-throw so callers can react (show error toasts, etc.).
        // Fire-and-forget callers must attach .catch() themselves.
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction],
  );

  return { execute, data, loading, error, setData };
}
