import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Masonry } from "@/shared/components/Masonry";
import { PostComponent } from "@/feature/content/components/PostComponent/PostComponent";
import { CreatePostModal } from "@/feature/content/components/CreatePostModal";

interface Post {
  content_id: number;
  creator_id: number;
  title: string;
  description: string;
  likes: number;
  comments: number;
  post_type: "post";
}

interface PostCreationProps {
  items: Post[];
  onDelete: (id: number) => void;
}

export function PostCreation({ items, onDelete }: PostCreationProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const currentUserId = 5; // TODO: Get from auth context

  return (
    <div className="space-y-6">
      <Button
        onClick={() => setShowCreateModal(true)}
        className="bg-burgundy-600 text-white hover:bg-burgundy-700 flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Create New Post
      </Button>
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        currentUserId={currentUserId}
      />
      <Masonry columns={4}>
        {items.map((item) => (
          <div key={item.content_id} className="relative group">
            <PostComponent post={item} />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onDelete(item.content_id)}
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
              >
                ✕ Delete
              </button>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  );
}
