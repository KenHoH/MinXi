import { ChevronRight } from "lucide-react";

interface Post {
  content_id: number;
  creator_id: number;
  title: string;
  description?: string;
  parent_id?: number;
}

interface ReplyChainProps {
  parentId: number; // Starting parent ID
  allPosts: Record<number, Post>; // Map of all posts for lookup
  onPostClick?: (id: number) => void;
}

export function ReplyChain({
  parentId,
  allPosts,
  onPostClick,
}: ReplyChainProps) {
  const findParents = (currentParentId: number | undefined): Post[] => {
    if (!currentParentId) {
      return [];
    }

    const post = allPosts[currentParentId];
    if (!post) {
      return [];
    }

    // Recursively find the parent's parents first
    const parentChain = findParents(post.parent_id);

    // Then add current post
    return [...parentChain, post];
  };

  const chain = findParents(parentId);

  if (chain.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 pb-4 border-b border-dark-700 space-y-2">
      <p className="text-xs text-gray-400">Reply chain</p>
      <div className="space-y-3">
        {chain.map((post, index) => (
          <div key={post.content_id} className="space-y-2">
            <button
              onClick={() => onPostClick?.(post.content_id)}
              className="w-full text-left p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-100 group-hover:text-burgundy-400 transition-colors">
                    Post #{post.content_id}: {post.title}
                  </p>
                  {post.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                      {post.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    @creator{post.creator_id}
                  </p>
                </div>
              </div>
            </button>

            {index < chain.length - 1 && (
              <div className="flex justify-center">
                <ChevronRight className="w-5 h-5 text-gray-500 transform rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
