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
  refresh: () => void;
}

export function ContentCreation({ items }: ContentCreationProps) {
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
      {user && (
        <CreateContentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          currentUserId={currentUserId}
          currentAreaId={currentAreaId}
        />
      )}

      <Masonry columns={4}>
        {items.map((item) => (
          <div key={item.content_id} className="relative group">
            <ContentComponent content={item} />
          </div>
        ))}
      </Masonry>
    </div>
  );
}
