import { useState, useEffect } from 'react'
import type { ShopItem } from '@/types/shop'

const MOCK_SHOP: ShopItem[] = [
  { id: '1', name: 'Premium Frame', description: 'Golden meme frame', price: 100, currency: 'stars', category: 'cosmetic', available: true },
  { id: '2', name: 'Meme Pack', description: '10 template pack', price: 50, currency: 'stars', category: 'boost', available: true },
  { id: '3', name: 'Star Gift', description: 'Send stars to friends', price: 25, currency: 'stars', category: 'gift', available: true },
  { id: '4', name: 'VIP Badge', description: 'Exclusive creator badge', price: 500, currency: 'stars', category: 'cosmetic', available: true },
  { id: '5', name: 'TON Boost', description: '2x earnings for 24h', price: 1, currency: 'ton', category: 'boost', available: true },
  { id: '6', name: 'Mega Pack', description: '50 premium templates', price: 200, currency: 'stars', category: 'boost', available: true },
]

export function useShop() {
  const [items, setItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchShop() {
      try {
        setLoading(true)
        // TODO: fetch('/api/shop')
        // TODO: fetch('/api/shop')
        setItems(MOCK_SHOP)
      } catch (err) {
        setError('Failed to load shop')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchShop()
  }, [])

  return { items, loading, error }
}
