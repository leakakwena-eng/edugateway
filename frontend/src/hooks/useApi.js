import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Runs an async loader on mount (and when deps change) and tracks its state.
 *   const { data, loading, error, reload, setData } = useApi(() => applicationApi.list(), []);
 */
export function useApi(loader, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const latest = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(loader, deps);

  const reload = useCallback(async () => {
    const call = ++latest.current;
    setLoading(true);
    setError(null);
    try {
      const result = await run();
      if (call === latest.current) setData(result);
    } catch (e) {
      if (call === latest.current) setError(e);
    } finally {
      if (call === latest.current) setLoading(false);
    }
  }, [run]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
}
