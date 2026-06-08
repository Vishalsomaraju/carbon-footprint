/**
 * @module hooks/useAsync
 */

import { useState, useCallback } from 'react';

type AsyncFunction<T, Args extends any[]> = (...args: Args) => Promise<T>;

export function useAsync<T, Args extends any[]>(asyncFunction: AsyncFunction<T, Args>) {
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
      } catch (err: any) {
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
