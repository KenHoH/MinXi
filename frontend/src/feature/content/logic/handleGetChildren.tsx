import type { FullContentWithHistoryProps } from "../components/models/FullContentWithHistory";
import type { CreateHistoryDto } from "../../../service/api/models/CreateHistoryDto";
import type { FullContentDto } from "@/service/api";

const handleGetChildren = async (
  parentId: number,
  userId: number,
  getChildPost: (parentId: number) => Promise<FullContentDto[] | null>,
  getByUser: (userId: number) => Promise<CreateHistoryDto[] | null>
): Promise<FullContentWithHistoryProps[]> => {
  console.log("Fetching children for parentId:", parentId);
  const [childrenList, histories] = await Promise.all([
    getChildPost(parentId),
    getByUser(userId),
  ]);

  if (!childrenList) return [];
  if (!histories)
    return childrenList.map((item) => ({
      ...item,
      liked: false,
      pinned: false,
    }));

  const mergedChildren: FullContentWithHistoryProps[] = childrenList.map(
    (item) => {
      const userHistory = histories.find(
        (h) => h.content_id === item.content_id
      );
      return {
        ...item,
        liked: userHistory?.liked || false,
        pinned: userHistory?.pinned || false,
      };
    }
  );
  return mergedChildren;
};

export default handleGetChildren;
