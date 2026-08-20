import { ImagePlus, Layers, History, Zap, Crown } from 'lucide-react'
import { useAppStore } from '@store/useAppStore'
import starsIcon from '@assets/icons/Stars.webp'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { WebApp } from '@utils/telegram'

interface EditorTopBarProps {
  onAddImage: () => void
  onChangeTemplate: () => void
}

export function EditorTopBar({ onAddImage, onChangeTemplate }: EditorTopBarProps) {
  const { energy, stars, proPlan, openTopup } = useAppStore()
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between gap-1.5 px-3 pt-2.5 pb-2 shrink-0 w-full">
      {/* Left: Quick Balances & Pro Status */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Pro Pill if active */}
        {proPlan && (
          <button
            type="button"
            onClick={() => {
              try {
                WebApp?.HapticFeedback?.selectionChanged?.()
              } catch {}
              navigate('/shop', { state: { tab: 'pro' } })
            }}
            className="h-9 px-2 rounded-[11px] bg-[#f5a623]/15 border border-[#f5a623]/40 flex items-center gap-1 hover:bg-[#f5a623]/25 active:scale-95 transition-all cursor-pointer shadow-[0_2px_8px_rgba(245,166,35,0.2)]"
            title={`${proPlan.name} Active`}
          >
            <Crown size={13} className="text-[#f5a623]" />
            <span className="text-[#f5a623] font-black text-[11px]">PRO</span>
          </button>
        )}

        {/* Energy Balance */}
        <button
          type="button"
          onClick={() => {
            try {
              WebApp?.HapticFeedback?.selectionChanged?.()
            } catch {}
            navigate('/shop', { state: { tab: 'energy' } })
          }}
          className="h-9 px-2.5 rounded-[11px] bg-[#1c1c1e] border border-white/10 flex items-center gap-1 hover:bg-white/10 active:scale-95 transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          title="Energy Balance"
        >
          <Zap size={13} className="text-[#2AABEE] fill-[#2AABEE]/30" />
          <span className="text-white font-extrabold text-[12px]">{energy.toLocaleString()}</span>
        </button>

        {/* Stars Balance */}
        <button
          type="button"
          onClick={() => {
            try {
              WebApp?.HapticFeedback?.selectionChanged?.()
            } catch {}
            openTopup('stars')
          }}
          className="h-9 px-2.5 rounded-[11px] bg-[#1c1c1e] border border-white/10 flex items-center gap-1 hover:bg-white/10 active:scale-95 transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          title="Stars Balance"
        >
          <img src={starsIcon} alt="Stars" className="w-3.5 h-3.5 object-contain" />
          <span className="text-white font-extrabold text-[12px]">{stars.toLocaleString()}</span>
        </button>
      </div>

      {/* Right: Tools Container (Add Image, Template, Recent) — Always visible */}
      <div className="flex-1 min-w-0 flex items-center h-9 bg-[#1c1c1e] border border-white/10 rounded-[11px] overflow-hidden">
        <button
          type="button"
          onClick={onAddImage}
          className="flex-1 flex items-center justify-center gap-1 h-full px-1 text-white/80 hover:text-white hover:bg-white/5 transition-all text-[11px] font-bold min-w-0 cursor-pointer"
        >
          <ImagePlus size={13} className="text-[#229ED9] shrink-0" />
          <span className="truncate">{t('editor.add_image', 'Image')}</span>
        </button>

        <div className="w-px h-4 bg-white/10 shrink-0" />

        <button
          type="button"
          onClick={onChangeTemplate}
          className="flex-1 flex items-center justify-center gap-1 h-full px-1 text-white/80 hover:text-white hover:bg-white/5 transition-all text-[11px] font-bold min-w-0 cursor-pointer"
        >
          <Layers size={13} className="text-purple-400 shrink-0" />
          <span className="truncate">{t('editor.template', 'Template')}</span>
        </button>

        <div className="w-px h-4 bg-white/10 shrink-0" />

        <button
          type="button"
          onClick={() => {}}
          className="flex-1 flex items-center justify-center gap-1 h-full px-1 text-white/80 hover:text-white hover:bg-white/5 transition-all text-[11px] font-bold min-w-0 cursor-pointer"
        >
          <History size={13} className="text-green-400 shrink-0" />
          <span className="truncate">{t('editor.recent', 'Recent')}</span>
        </button>
      </div>
    </div>
  )
}
