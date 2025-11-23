interface CommentParentComponentProps {
  contentId: number;
}

// Dummy comments data
const dummyComments = [
  {
    id: 1,
    creator_id: 201,
    text: "This is amazing! Love the detail.",
    createdAt: "2 hours ago",
  },
  {
    id: 2,
    creator_id: 202,
    text: "Great work! Would love to see more like this.",
    createdAt: "1 hour ago",
  },
  {
    id: 3,
    creator_id: 203,
    text: "Incredible content! Following for more.",
    createdAt: "30 minutes ago",
  },
];

export function CommentParentComponent({
  contentId,
}: CommentParentComponentProps) {
  return (
    <div className="space-y-4">
      {dummyComments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <img
            src={`/api/placeholder?size=32&text=U${comment.creator_id}`}
            alt="Commenter"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-gray-100">
                @user{comment.creator_id}
              </span>
              <span className="text-xs text-gray-400">{comment.createdAt}</span>
            </div>
            <p className="text-sm text-gray-300">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
