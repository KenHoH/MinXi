import { useAuthContext } from "@/feature/auth/context/AuthContext";
import type { CreateHistoryDto } from "@/service/api";
import useHistoryService from "@/shared/hooks/useHistoryService";
import { useEffect, useState } from "react";

export default function useGetHistory() {
  const { user } = useAuthContext();
  const { getByUser } = useHistoryService();
  const [history, setHistory] = useState<CreateHistoryDto[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      const res = await getByUser(user.user_id);
      if (res) {
        setHistory(res);
      }
    };

    fetchHistory();
  }, [user]);

  return [history];
}
