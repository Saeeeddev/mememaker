export interface EnergyPack {
  id: number | string
  name: string
  energy: number
  stars: number
  discount?: number
  active?: boolean
  image?: string
}

export interface ProPlan {
  id: number | string
  label: string
  period: string
  stars: number
  color?: string
  popular?: boolean
  noWatermarkLimit?: number | 'unlimited'
  withWatermarkLimit?: number | 'unlimited'
  aiGenerationsLimit?: number | 'unlimited'
  dailySpinsBonus?: number
  bonusEnergy?: number
}

export interface UserProPlan {
  id: number | string
  name: string
  period: string
  expiresAt: string
  color?: string
  noWatermarkLimit: number | 'unlimited'
  noWatermarkUsed: number
  withWatermarkLimit: number | 'unlimited'
  withWatermarkUsed: number
  aiGenerationsLimit: number | 'unlimited'
  aiGenerationsUsed: number
  dailySpinsBonus: number
  bonusEnergy: number
}

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
