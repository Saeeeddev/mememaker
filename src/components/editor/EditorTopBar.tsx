import { ImagePlus, Layers } from 'lucide-react'
import { useAppStore } from '@store/useAppStore'
import starsIcon from '@assets/icons/stars.png'

interface EditorTopBarProps {
  /** Called when user taps the top-left exit-fullscreen button */
  onExit: () => void
  onAddImage: () => void
  onChangeTemplate: () => void
}

export function EditorTopBar({ onAddImage, onChangeTemplate }: EditorTopBarProps) {
  const { openTopup } = useAppStore()

  return (
    <div className="flex items-center gap-2 px-4 pt-4 pb-3 shrink-0">
      {/* Stars balance button */}
      <button
        onClick={() => openTopup('stars')}
        className="h-11 rounded-[13px] bg-[#1c1c1e] border border-white/10 flex items-center gap-1.5 px-3 hover:bg-white/10 hover:border-white/20 active:scale-[0.95] transition-all shrink-0"
      >
        <span className="text-white font-bold text-[14px]">0</span>
        <img src={starsIcon} alt="Stars" className="w-4 h-4" />
      </button>

      {/* Toolbar pill — fills remaining space */}
      <div className="flex-1 flex items-center h-11 bg-[#1c1c1e] border border-white/10 rounded-[13px] overflow-hidden">
        <button
          onClick={onAddImage}
          className="flex-1 flex items-center justify-center gap-1.5 h-full text-white/70 hover:text-white hover:bg-white/5 transition-all text-[13px] font-semibold"
        >
          <ImagePlus size={15} className="text-[#229ED9]" />
          Add Image
        </button>

        <div className="w-px h-6 bg-white/10 shrink-0" />

        <button
          onClick={onChangeTemplate}
          className="flex-1 flex items-center justify-center gap-1.5 h-full text-white/70 hover:text-white hover:bg-white/5 transition-all text-[13px] font-semibold"
        >
          <Layers size={15} className="text-purple-400" />
          Change Template
        </button>
      </div>
    </div>
  )
}
