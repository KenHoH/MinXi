const refetchPostTree = async (
  postId: number,
  areaId: number,
  getAncestorPost: (postId: number, areaId: number) => Promise<any>
) => {
  try {
    const ancestorData = await getAncestorPost(postId, areaId);
    if (ancestorData) return ancestorData;
    return [];
  } catch (error) {
    console.error("Failed to fetch ancestors:", error);
    return [];
  }
};

export default refetchPostTree;
