/**
 * @module hooks/useAsync
 */

import { useState, useCallback } from 'react';

type AsyncFunction<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

export function useAsync<T, Args extends unknown[]>(asyncFunction: AsyncFunction<T, Args>): { execute: (...args: Args) => Promise<T>; data: T | null; loading: boolean; error: Error | null; setData: React.Dispatch<React.SetStateAction<T | null>> } {
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
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  return { execute, data, loading, error, setData };
}
