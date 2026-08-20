import { Zap } from 'lucide-react'
import starsIcon from '@assets/icons/Stars.webp'
import { useAppStore } from '@store/useAppStore'
import { useNavigate } from 'react-router-dom'
import { WebApp } from '@utils/telegram'

interface BalanceBadgesProps {
  showEnergy?: boolean
  showStars?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function BalanceBadges({
  showEnergy = true,
  showStars = true,
  className = '',
  size = 'md',
}: BalanceBadgesProps) {
  const { energy, stars, openTopup } = useAppStore()
  const navigate = useNavigate()

  const handleEnergyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      WebApp?.HapticFeedback?.selectionChanged?.()
    } catch {}
    navigate('/shop', { state: { tab: 'energy' } })
  }

  const handleStarsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      WebApp?.HapticFeedback?.selectionChanged?.()
    } catch {}
    openTopup('stars')
  }

  const sizeClasses = {
    sm: {
      pill: 'h-8 px-2.5 rounded-[11px] text-[12px] gap-1.5',
      iconEnergy: 'w-3.5 h-3.5',
      iconStars: 'w-3.5 h-3.5',
    },
    md: {
      pill: 'h-9 px-3 rounded-[13px] text-[13px] gap-1.5',
      iconEnergy: 'w-4 h-4',
      iconStars: 'w-4 h-4',
    },
    lg: {
      pill: 'h-11 px-3.5 rounded-[15px] text-[14px] gap-2',
      iconEnergy: 'w-4.5 h-4.5',
      iconStars: 'w-4.5 h-4.5',
    },
  }[size]

  return (
    <div className={`flex items-center gap-2 shrink-0 ${className}`}>
      {showEnergy && (
        <button
          type="button"
          onClick={handleEnergyClick}
          className={`flex items-center bg-[#18191d] border border-white/10 hover:border-white/20 active:scale-95 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.3)] cursor-pointer select-none ${sizeClasses.pill}`}
          title="Energy Balance"
        >
          <Zap className={`${sizeClasses.iconEnergy} text-[#2AABEE] fill-[#2AABEE]/30 shrink-0`} />
          <span className="font-extrabold text-white leading-none">{energy.toLocaleString()}</span>
        </button>
      )}

      {showStars && (
        <button
          type="button"
          onClick={handleStarsClick}
          className={`flex items-center bg-[#18191d] border border-white/10 hover:border-white/20 active:scale-95 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.3)] cursor-pointer select-none ${sizeClasses.pill}`}
          title="Stars Balance"
        >
          <img src={starsIcon} alt="Stars" className={`${sizeClasses.iconStars} object-contain shrink-0`} />
          <span className="font-extrabold text-white leading-none">{stars.toLocaleString()}</span>
        </button>
      )}
    </div>
  )
}
