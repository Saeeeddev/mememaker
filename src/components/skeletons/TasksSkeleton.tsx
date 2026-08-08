export function TasksSkeleton() {
  return (
    <div className="animate-pulse pb-10 pt-2">
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-[10px] bg-white/8" />
          <div className="h-7 w-20 rounded bg-white/8" />
        </div>
        <div className="h-6 w-10 rounded-full bg-white/8" />
      </div>

      <div className="space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 bg-[#141416] border border-white/8 rounded-[18px] px-3 py-3 min-h-[78px]">
              <div className="w-[48px] h-[48px] rounded-[14px] bg-white/8 shrink-0" />
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
