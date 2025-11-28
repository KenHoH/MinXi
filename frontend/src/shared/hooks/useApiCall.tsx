import { useCallback, useState } from "react";
import { useLoading } from "../context/LoadingContext";
import { useToast } from "../context/ToastContext";

export default function useApiCall() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();

  const call = useCallback(
    async <T,>(apiFn: () => Promise<T>): Promise<T | null> => {
      try {
        setError(null);

        const res = await apiFn();
        setData(res);

        return res;
      } catch (err: any) {
        const msg = err?.body?.message ?? err?.message ?? "Error occurred";
        setError(msg);
        showToast(msg);
        return null;
      } finally {
      }
    },
    [showLoading, hideLoading, showToast]
  );

  return { data, loading, error, call };
}
