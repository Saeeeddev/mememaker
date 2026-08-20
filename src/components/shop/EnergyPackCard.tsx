import { Zap } from 'lucide-react'
import starsIcon from '@assets/icons/Stars.webp'
import type { EnergyPack } from '@/types/shop'
import { useTranslation } from 'react-i18next'

interface EnergyPackCardProps {
  pack: EnergyPack
  onBuy?: (pack: EnergyPack) => void
}

export function EnergyPackCard({ pack, onBuy }: EnergyPackCardProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-[#141416] rounded-[18px] p-4 flex items-center justify-between gap-3 shadow-md">
      {/* Icon Area & Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-[46px] h-[46px] rounded-[14px] bg-[#1c1c1e] border border-[#35363a] flex items-center justify-center shrink-0">
          <Zap size={22} className="text-[#56b6ff] fill-[#56b6ff]/25" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15.5px] font-bold text-white truncate leading-tight">
              {pack.name}
            </h3>
            {pack.discount && pack.discount > 0 ? (
              <span className="bg-[#29a896] px-2 py-0.5 rounded-full text-white font-bold text-[11px] leading-none shrink-0">
                -{pack.discount}%
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="bg-[#1f3a52] px-2.5 py-0.5 rounded-full text-[#56b6ff] font-bold text-[12px] flex items-center gap-1">
              +{pack.energy.toLocaleString()} ⚡ {t('shop.energy', 'Energy')}
            </span>
          </div>
        </div>
      </div>

      {/* Profile style Buy Button (White pill with Stars) */}
      <button
        type="button"
        onClick={() => onBuy?.(pack)}
        className="shrink-0 bg-white text-black font-extrabold text-[14px] rounded-[14px] px-3.5 py-2.5 hover:bg-white/90 active:scale-95 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
      >
        <span>{pack.stars.toLocaleString()}</span>
        <img src={starsIcon} alt="Stars" className="w-4 h-4 object-contain" />
      </button>
    </div>
  )
}
