import type { ShopItem as IShopItem } from '@/types/shop'
import { Sparkles, Diamond } from 'lucide-react'

interface ShopItemProps {
  item: IShopItem
  onBuy?: (item: IShopItem) => void
}

export function ShopItem({ item, onBuy }: ShopItemProps) {
  const Icon = item.currency === 'stars' ? Sparkles : Diamond

  return (
    <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-4 flex flex-col h-full">
      <div className="aspect-square rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mb-4 flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-white/10" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-white mb-1">{item.name}</h3>
        <p className="text-xs text-white/40 line-clamp-2">{item.description}</p>
      </div>

      <button
        onClick={() => onBuy?.(item)}
        disabled={!item.available}
        className={`mt-4 w-full py-2 rounded-xl flex items-center justify-center gap-2 font-semibold transition-colors ${
          item.available
            ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
            : 'bg-white/5 text-white/20'
        }`}
      >
        <span>{item.price}</span>
        <Icon className="w-4 h-4" />
      </button>
    </div>
  )
}
