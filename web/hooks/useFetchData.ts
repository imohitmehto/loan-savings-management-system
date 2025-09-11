import { useState, useEffect } from 'react';
export function useFetchData<T>(apiCall: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    apiCall()
      .then(res => {
        if (mounted) setData(res);
      })
      .catch(err => {
        if (mounted) {
          console.error('Data fetching error', err);
          setError('Failed to load data.');
          setData(null); // fallback to null/empty state
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [apiCall]);

  return { data, loading, error };
}
