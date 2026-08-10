import { useShop } from '@hooks/useShop'
import { ShopItem } from '@components/shop/ShopItem'
import { ShopSkeleton } from '@components/skeletons/ShopSkeleton'
import { Store } from 'lucide-react'

export function Shop() {
  const { items, loading } = useShop()

  if (loading) return <ShopSkeleton />

  return (
    <div className="relative">
      <div className="flex flex-col items-center pt-6 pb-6">
        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
          <Store className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Shop</h1>
        <p className="text-white/50 text-sm">Upgrade your meme arsenal</p>
      </div>

      <div className="grid grid-cols-2 gap-3 px-2">
        {items.map((item) => (
          <ShopItem key={item.id} item={item} disabled />
        ))}
      </div>
    </div>
  )
}

export default Shop
