import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Masonry } from "@/shared/components/Masonry";
import { ContentComponent } from "@/feature/content/components/ContentComponent/ContentComponent";

import { useAuthContext } from "@/feature/auth/context/AuthContext";
import type { FullContentDto } from "@/service/api";
import { CreateContentModal } from "./CreateContent/CreateContentModal";

interface ContentCreationProps {
  items: FullContentDto[];
  onDelete: (id: number) => void;
}

export function ContentCreation({ items, onDelete }: ContentCreationProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuthContext();
  const currentUserId = user?.user_id || 0;
  const currentAreaId = user?.area_id || 0;

  return (
    <div className="space-y-6">
      <Button
        onClick={() => setShowCreateModal(true)}
        className="bg-burgundy-600 text-white hover:bg-burgundy-700 flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Create New Content
      </Button>
      <CreateContentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        currentUserId={currentUserId}
        currentAreaId={currentAreaId}
      />
      <Masonry columns={4}>
        {items.map((item) => (
          <div key={item.content_id} className="relative group">
            <ContentComponent content={item} />
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
