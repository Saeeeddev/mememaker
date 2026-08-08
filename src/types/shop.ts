export interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  currency: 'stars' | 'ton'
  image?: string
  category: 'gift' | 'boost' | 'cosmetic'
  available: boolean
}
