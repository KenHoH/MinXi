export function FeedListSkeleton() {
  return (
    <div className="p-4">
      <div
        style={{
          columnCount: 4,
          columnGap: "1rem",
        }}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="mb-4 animate-pulse"
            style={{ breakInside: "avoid" }}
          >
            <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
              <div className="h-4 bg-dark-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-dark-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-dark-700 rounded w-2/3 mb-4"></div>
              <div className="flex gap-4">
                <div className="h-3 bg-dark-700 rounded w-12"></div>
                <div className="h-3 bg-dark-700 rounded w-12"></div>
                <div className="h-3 bg-dark-700 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
