export const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black w-full pb-24 -mx-4 -mt-4">
      {/* Hero gradient area matching profile's teal theme */}
      <div
        className="pt-7 pb-9 text-center relative"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 0%, #2c5f66 0%, #1c4550 35%, #12303c 65%, #0a1f28 100%)',
        }}
      >
        {/* Balance skeleton */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-28 h-3.5 rounded-full bg-white/10 animate-pulse" />
          <div className="w-40 h-10 rounded-xl bg-white/10 animate-pulse" />
          <div className="w-16 h-5 rounded-full bg-white/8 animate-pulse" />
        </div>

        {/* Action pills skeleton */}
        <div className="flex justify-center gap-3 px-4 mt-7">
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full h-11 rounded-full bg-white/8 animate-pulse" />
            <div className="w-16 h-3 rounded-full bg-white/6 animate-pulse" />
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full h-11 rounded-full bg-white/8 animate-pulse" />
            <div className="w-16 h-3 rounded-full bg-white/6 animate-pulse" />
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full h-11 rounded-full bg-white/8 animate-pulse" />
            <div className="w-16 h-3 rounded-full bg-white/6 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content sheet skeleton */}
      <div className="bg-black -mt-3.5 rounded-t-[22px] relative z-2 px-4 pt-5">
        {/* Profile row skeleton */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-[46px] h-[46px] rounded-full bg-white/8 animate-pulse" />
            <div className="flex flex-col gap-2">
              <div className="w-20 h-4 rounded bg-white/8 animate-pulse" />
              <div className="w-28 h-3 rounded bg-white/5 animate-pulse" />
            </div>
          </div>
          <div className="w-[38px] h-[38px] rounded-xl bg-white/8 animate-pulse" />
        </div>

        {/* Meme history card skeleton */}
        <div className="bg-[#141416] rounded-[18px] p-4">
          <div className="flex items-center justify-between mb-3.5">
            <div className="w-24 h-4 rounded bg-white/8 animate-pulse" />
            <div className="w-20 h-3 rounded bg-white/5 animate-pulse" />
          </div>
          <div className="flex gap-2.5">
            <div className="flex-1 aspect-square rounded-[14px] bg-white/5 animate-pulse" />
            <div className="flex-1 aspect-square rounded-[14px] bg-white/5 animate-pulse" />
            <div className="flex-1 aspect-square rounded-[14px] bg-white/5 animate-pulse" />
          </div>
          <div className="flex items-center justify-between mt-3.5">
            <div className="w-24 h-3 rounded bg-white/5 animate-pulse" />
            <div className="w-16 h-3 rounded bg-white/5 animate-pulse" />
          </div>
        </div>

        {/* Invite friend skeleton */}
        <div className="mt-4 bg-[#141416] rounded-[18px] p-3.5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-white/8 animate-pulse" />
          <div className="w-24 h-4 rounded bg-white/8 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
