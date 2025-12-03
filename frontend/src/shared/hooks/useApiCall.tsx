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
        const backend = err?.response?.data ?? err?.body ?? {};

        const msg =
          backend.errorMessage ||
          backend.message ||
          err?.message ||
          "Something went wrong";

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
