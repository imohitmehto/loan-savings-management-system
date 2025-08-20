import { useState, useEffect, useCallback } from "react";
import { safeApiCall } from "@/lib/api/helpers/apiHelpers";

/**
 * Custom hook to perform API calls using safeApiCall wrapper
 * @param apiFn - The async function that returns a Promise (API call)
 * @param deps - Dependency array to control when to refresh data
 */
export function useSafeApi<T>(apiFn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await safeApiCall(apiFn);
      setData(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  useEffect(() => {
    fetchData();
  }, deps);

  return { data, loading, error, refetch: fetchData };
}
