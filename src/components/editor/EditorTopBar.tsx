import { Minimize2, ImagePlus, Layers } from 'lucide-react'

interface EditorTopBarProps {
  /** Called when user taps the top-left exit-fullscreen button */
  onExit: () => void
  onAddImage: () => void
  onChangeTemplate: () => void
}

export function EditorTopBar({ onExit, onAddImage, onChangeTemplate }: EditorTopBarProps) {
  return (
    <div className="flex items-center gap-2 px-4 pt-4 pb-3 shrink-0">
      {/* Exit full-screen button */}
      <button
        onClick={onExit}
        className="w-11 h-11 rounded-[13px] bg-[#1c1c1e] border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 active:scale-[0.95] transition-all shrink-0"
        aria-label="Exit editor"
      >
        <Minimize2 size={18} />
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
