export function ShopSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="text-center pt-4 pb-2">
        <div className="w-32 h-8 bg-white/8 rounded-lg mx-auto mb-2" />
        <div className="w-48 h-4 bg-white/5 rounded mx-auto" />
      </div>

      {/* Categories */}
      <div className="flex gap-3 px-4 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-24 h-8 bg-[#141416] rounded-full shrink-0" />
        ))}
      </div>

      {/* Featured Products */}
      <div className="flex gap-4 px-4 overflow-hidden mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-32 h-40 bg-[#141416] rounded-[18px] shrink-0" />
        ))}
      </div>

      {/* List Products */}
      <div className="space-y-4 px-4 mt-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-[#141416] p-3 rounded-[18px]">
            <div className="w-12 h-12 rounded-[14px] bg-white/8 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="w-3/4 h-4 bg-white/8 rounded" />
              <div className="w-1/2 h-3 bg-white/5 rounded" />
            </div>
            <div className="w-16 h-8 bg-white/8 rounded-[14px]" />
          </div>
        ))}
      </div>
    </div>
  )
}
