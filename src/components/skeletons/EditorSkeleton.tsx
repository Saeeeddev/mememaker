export function EditorSkeleton() {
  return (
    <div className="animate-pulse space-y-4 h-full flex flex-col">
      {/* Canvas Area Skeleton */}
      <div className="w-full aspect-square bg-white/5 rounded-2xl border border-white/10 shrink-0" />
      
      {/* Toolbar Skeleton */}
      <div className="h-14 bg-white/5 rounded-xl border border-white/10 w-full" />
      
      {/* Small Tools Row */}
      <div className="flex gap-2 mt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-12 h-12 bg-white/5 rounded-xl shrink-0" />
        ))}
      </div>
      
      <div className="flex-1" />
      
      {/* Bottom Actions */}
      <div className="space-y-3 pb-8">
        <div className="h-12 bg-white/5 rounded-xl w-full" />
        <div className="h-12 bg-white/10 rounded-xl w-full" />
      </div>
    </div>
  )
}
