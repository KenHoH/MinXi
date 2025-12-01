import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Masonry } from "@/shared/components/Masonry";
import { BoardModal } from "./BoardModal";
import { CreateBoardModal } from "@/feature/create/components/CreateBoardContent/CreateBoardModal";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import type { BoardDto } from "@/service/api";

interface BoardCreationProps {
  items: BoardDto[];
  onDelete: (id: number) => void;
}

export function BoardCreation({ items, onDelete }: BoardCreationProps) {
  const [selectedBoard, setSelectedBoard] = useState<BoardDto | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuthContext();
  const currentUserId = user?.user_id || 0;

  return (
    <>
      <div className="space-y-6">
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-burgundy-600 text-white hover:bg-burgundy-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Board
        </Button>
        <CreateBoardModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          currentUserId={currentUserId}
        />
        <Masonry columns={4}>
          {items.map((item) => (
            <Card
              key={item.board_id}
              onClick={() => setSelectedBoard(item)}
              className="bg-dark-800 border border-dark-700 cursor-pointer hover:border-burgundy-600 hover:shadow-lg hover:shadow-burgundy-500 transition-all"
            >
              <CardContent className="pt-6">
                <div className="aspect-square bg-dark-700 rounded mb-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.board_thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <h3 className="font-medium text-gray-100 mb-2">{item.title}</h3>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">
                  {item.description || "No description"}
                </p>
                <div className="text-xs text-gray-500 mb-3">
                  {item.contents?.length || 0} items
                </div>
              </CardContent>
            </Card>
          ))}
        </Masonry>
      </div>

      {selectedBoard && (
        <BoardModal
          board={selectedBoard}
          onClose={() => setSelectedBoard(null)}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
