import type { FullContentWithHistoryProps } from "../components/models/FullContentWithHistory";
import type { CreateHistoryDto } from "../../../service/api/models/CreateHistoryDto";
import type { FullContentDto } from "@/service/api";
const handleGetAncestors = async (
  postId: number,
  areaId: number,
  userId: number,
  getAncestorPost: (
    postId: number,
    areaId: number
  ) => Promise<FullContentDto[] | null>,
  getByUser: (userId: number) => Promise<CreateHistoryDto[] | null>
): Promise<FullContentWithHistoryProps[]> => {
  const [ancestorsList, histories] = await Promise.all([
    getAncestorPost(postId, areaId),
    getByUser(userId),
  ]);

  if (!ancestorsList) return [];
  if (!histories)
    return ancestorsList.map((item) => ({
      ...item,
      liked: false,
      pinned: false,
    }));

  const mergedAncestors = ancestorsList.map((item) => {
    const userHistory = histories.find((h) => h.content_id === item.content_id);
    return {
      ...item,
      liked: userHistory?.liked || false,
      pinned: userHistory?.pinned || false,
    };
  });

  return mergedAncestors || [];
};

export default handleGetAncestors;
