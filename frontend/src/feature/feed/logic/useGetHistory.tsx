import { useAuthContext } from "@/feature/auth/context/AuthContext";
import type { CreateHistoryDto } from "@/service/api";
import useHistoryService from "@/shared/hooks/useHistoryService";
import { useEffect, useState } from "react";

export default function useGetHistory() {
  const { user } = useAuthContext();
  const { getByUser } = useHistoryService();
  const [history, setHistory] = useState<CreateHistoryDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setHistory([]);
        return;
      }
      setLoading(true);
      try {
        const res = await getByUser(user.user_id);
        if (res) {
          setHistory(res);
        } else {
          setHistory([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  return [history, loading] as const;
}
