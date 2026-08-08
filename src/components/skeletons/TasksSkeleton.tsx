export function TasksSkeleton() {
  return (
    <div className="animate-pulse space-y-6 pb-10">
      {/* Header Skeleton */}
      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="w-16 h-16 bg-white/8 rounded-full mb-4 shrink-0" />
        <div className="w-32 h-8 bg-white/8 rounded-lg mb-3" />
        <div className="w-24 h-6 bg-white/5 rounded-full" />
      </div>

      {/* List Skeleton */}
      <div className="space-y-3 px-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-[#141416] border border-[#35363a] rounded-[18px] p-4">
            <div className="w-12 h-12 rounded-[14px] bg-white/8 shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="w-3/4 h-4 bg-white/8 rounded" />
              <div className="w-1/2 h-3 bg-white/5 rounded" />
              <div className="w-1/4 h-3 bg-white/5 rounded" />
            </div>
            <div className="w-16 h-8 bg-white/8 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
