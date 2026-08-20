import type { EnergyPack } from '@/types/shop'
import { EnergyPackCard } from './EnergyPackCard'
import { useTranslation } from 'react-i18next'

interface EnergyPackListProps {
  packs: EnergyPack[]
  onBuy?: (pack: EnergyPack) => void
}

export function EnergyPackList({ packs, onBuy }: EnergyPackListProps) {
  const { t } = useTranslation()

  if (packs.length === 0) {
    return (
      <div className="text-center py-8 text-white/40">
        {t('shop.no_packs', 'No energy packs available')}
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {packs.map((pack) => (
        <EnergyPackCard key={pack.id} pack={pack} onBuy={onBuy} />
      ))}
    </div>
  )
}
