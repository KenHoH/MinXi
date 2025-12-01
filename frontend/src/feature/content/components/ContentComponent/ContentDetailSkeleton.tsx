export function ContentDetailSkeleton() {
  return (
    <div className="w-80 flex flex-col bg-dark-800 border-l border-dark-700 p-4 space-y-4">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-dark-600 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-dark-600 rounded w-24 animate-pulse" />
            <div className="h-3 bg-dark-600 rounded w-16 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <div className="h-5 bg-dark-600 rounded w-full animate-pulse" />
          <div className="h-4 bg-dark-600 rounded w-full animate-pulse" />
          <div className="h-4 bg-dark-600 rounded w-3/4 animate-pulse" />
        </div>

        <div className="h-4 bg-dark-600 rounded w-20 animate-pulse" />
      </div>

      <div className="border-t border-dark-700" />

      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-dark-600 rounded-full animate-pulse" />
          <div className="flex-1 h-10 bg-dark-600 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="border-t border-dark-700" />

      <div className="flex gap-4 pt-2">
        <div className="h-5 bg-dark-600 rounded w-16 animate-pulse" />
        <div className="h-5 bg-dark-600 rounded w-16 animate-pulse" />
      </div>
    </div>
  );
}
