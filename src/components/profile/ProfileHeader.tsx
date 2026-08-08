import { Settings } from 'lucide-react'
import { useAppStore } from '@store/useAppStore'

export const ProfileHeader = () => {
  const { openSettings } = useAppStore()

  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-[46px] h-[46px] rounded-full bg-gradient-to-b from-[#5bb8ff] to-[#2e8fe0] flex items-center justify-center text-white text-[19px] font-bold">
          S
        </div>
        {/* Info */}
        <div>
          <div className="text-white text-base font-bold">Saeed</div>
          <div className="text-[#8a8f98] text-[13.5px] mt-px">@Saeed_dolat_i</div>
        </div>
      </div>

      {/* Settings Button */}
      <button
        onClick={openSettings}
        className="w-[38px] h-[38px] rounded-xl bg-[#1c1c1e] flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition-colors"
      >
        <Settings size={18} />
      </button>
    </div>
  )
}
