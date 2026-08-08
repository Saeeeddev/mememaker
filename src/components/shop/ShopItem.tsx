import type { ShopItem as IShopItem } from '@/types/shop'
import { Sparkles, Diamond } from 'lucide-react'

interface ShopItemProps {
  item: IShopItem
  onBuy?: (item: IShopItem) => void
  disabled?: boolean
}

export function ShopItem({ item, onBuy, disabled = false }: ShopItemProps) {
  const Icon = item.currency === 'stars' ? Sparkles : Diamond
  const isDisabled = disabled || !item.available

  return (
    <div className="bg-[#141416] border border-white/5 rounded-2xl p-4 flex flex-col h-full opacity-60">
      <div className="aspect-square rounded-xl bg-[#2C2C2E] mb-4 flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#2C2C2E]" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-white mb-1">{item.name}</h3>
        <p className="text-xs text-white/40 line-clamp-2">{item.description}</p>
      </div>

      <button
        onClick={() => onBuy?.(item)}
        disabled={isDisabled}
        className={`mt-4 w-full py-2 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors ${
          isDisabled
            ? 'bg-[#2C2C2E] text-white/25 cursor-not-allowed'
            : 'bg-[#229ED9]/10 text-[#2AABEE] hover:bg-[#229ED9]/20'
        }`}
      >
        <span>{item.price}</span>
        <Icon className="w-4 h-4" />
      </button>
    </div>
  )
}
