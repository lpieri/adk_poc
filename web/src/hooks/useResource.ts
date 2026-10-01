import { useCallback, useEffect, useState } from "react";

export interface Resource<T> {
  data: T;
  loading: boolean;
  error: boolean;
  reload: () => Promise<void>;
}

export const useResource = <T>(load: () => Promise<T>, initial: T): Resource<T> => {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setData(await load());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [load]);
  useEffect(() => {
    void reload();
  }, [reload]);
  return { data, loading, error, reload };
};
