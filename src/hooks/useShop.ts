import { useState, useEffect } from 'react'
import type { EnergyPack, ProPlan, ShopItem } from '@/types/shop'

export const INITIAL_ENERGY_PACKS: EnergyPack[] = [
  { id: 1, name: 'Starter Pack', energy: 50, stars: 25, discount: 0, active: true },
  { id: 2, name: 'Creator Pack', energy: 150, stars: 70, discount: 7, active: true },
  { id: 3, name: 'Meme Master', energy: 500, stars: 200, discount: 20, active: true },
  { id: 4, name: 'Whale Vault', energy: 2000, stars: 650, discount: 35, active: true },
  { id: 5, name: 'Ultra VIP Pack', energy: 5000, stars: 1500, discount: 45, active: true },
]

export const INITIAL_PRO_PLANS: ProPlan[] = [
  {
    id: 1,
    label: 'Daily Pro',
    period: '24 hours',
    stars: 20,
    color: '#2AABEE',
    popular: false,
    noWatermarkLimit: 50,
    withWatermarkLimit: 100,
    aiGenerationsLimit: 5,
    dailySpinsBonus: 3,
    bonusEnergy: 50,
  },
  {
    id: 2,
    label: 'Creator Week',
    period: '7 days',
    stars: 75,
    color: '#F5A623',
    popular: false,
    noWatermarkLimit: 100,
    withWatermarkLimit: 200,
    aiGenerationsLimit: 15,
    dailySpinsBonus: 5,
    bonusEnergy: 100,
  },
  {
    id: 3,
    label: 'Monthly Pro',
    period: '30 days',
    stars: 200,
    color: '#229ED9',
    popular: true,
    noWatermarkLimit: 200,
    withWatermarkLimit: 'unlimited',
    aiGenerationsLimit: 50,
    dailySpinsBonus: 10,
    bonusEnergy: 300,
  },
  {
    id: 4,
    label: 'VIP Annual',
    period: '365 days',
    stars: 1200,
    color: '#A358DF',
    popular: false,
    noWatermarkLimit: 'unlimited',
    withWatermarkLimit: 'unlimited',
    aiGenerationsLimit: 200,
    dailySpinsBonus: 20,
    bonusEnergy: 1500,
  },
]

export function useShop() {
  const [energyPacks, setEnergyPacks] = useState<EnergyPack[]>([])
  const [proPlans, setProPlans] = useState<ProPlan[]>([])
  const [items, setItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function fetchShop() {
      try {
        setLoading(true)
        // Simulate network delay for smooth skeleton demonstration
        await new Promise((resolve) => setTimeout(resolve, 300))
        if (isMounted) {
          setEnergyPacks(INITIAL_ENERGY_PACKS.filter((p) => p.active !== false))
          setProPlans(INITIAL_PRO_PLANS)
          setItems([])
        }
      } catch (err) {
        if (isMounted) setError('Failed to load shop')
        console.error(err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchShop()
    return () => {
      isMounted = false
    }
  }, [])

  return {
    energyPacks,
    proPlans,
    items,
    loading,
    error,
  }
}
