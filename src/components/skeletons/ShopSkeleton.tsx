export function ShopSkeleton() {
  return (
    <div className="animate-pulse pt-2 px-1 pb-24">
      {/* Header Skeleton */}
      <div className="mb-4 flex items-center justify-between px-2 shrink-0">
        <div className="h-8 w-28 rounded-lg bg-white/8" />
        <div className="h-6 w-20 rounded-full bg-white/8" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-1 mb-6 bg-white/5 p-1.5 rounded-[20px] mx-2 shrink-0">
        <div className="h-10 bg-white/8 rounded-[14px] flex-1" />
        <div className="h-10 bg-white/8 rounded-[14px] flex-1" />
      </div>

      {/* Cards Skeleton */}
      <div className="space-y-2.5 px-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-[#141416] border border-white/8 rounded-[18px] px-3.5 py-3 min-h-[78px]"
          >
            <div className="w-[48px] h-[48px] rounded-[14px] bg-white/8 shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="w-3/5 h-4 bg-white/8 rounded" />
              <div className="w-2/5 h-3 bg-white/5 rounded" />
            </div>
            <div className="w-20 h-9 bg-white/8 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
