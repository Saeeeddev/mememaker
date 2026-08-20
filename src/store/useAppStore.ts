import { create } from 'zustand'
import type { TelegramUser } from '@/types/telegram'
import type { UserProPlan } from '@/types/shop'

type TopupTab = 'stars'

interface AppState {
  // Telegram user
  user: TelegramUser | null
  setUser: (user: TelegramUser | null) => void

  // User balances
  stars: number
  energy: number
  setStars: (stars: number) => void
  setEnergy: (energy: number) => void
  addStars: (amount: number) => void
  addEnergy: (amount: number) => void
  spendStars: (amount: number) => boolean
  spendEnergy: (amount: number) => boolean

  // Pro Plan
  proPlan: UserProPlan | null
  setProPlan: (plan: UserProPlan | null) => void

  // Daily AI generation usage
  freeAiGenerationsUsed: number
  consumeAiGeneration: () => { success: boolean; isFree: boolean; error?: string }

  // Watermark-Free Save consumption & promo bonus
  watermarkFreeSavesBonus: number
  addWatermarkFreeBonus: (amount: number) => void
  consumeWatermarkFreeSave: () => { success: boolean; fromPro: boolean; error?: string }

  // Top-up popup
  topupOpen: boolean
  topupTab: TopupTab
  openTopup: (tab?: TopupTab) => void
  closeTopup: () => void

  // Settings popup
  settingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void

  // Settings state
  language: 'RU' | 'EN' | 'ZH'
  setLanguage: (lang: 'RU' | 'EN' | 'ZH') => void
  hapticFeedback: boolean
  toggleHapticFeedback: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),

  // Initial user balances
  stars: 120,
  energy: 85,
  setStars: (stars) => set({ stars }),
  setEnergy: (energy) => set({ energy }),
  addStars: (amount) => set((s) => ({ stars: s.stars + amount })),
  addEnergy: (amount) => set((s) => ({ energy: s.energy + amount })),
  spendStars: (amount) => {
    if (get().stars >= amount) {
      set((s) => ({ stars: s.stars - amount }))
      return true
    }
    return false
  },
  spendEnergy: (amount) => {
    if (get().energy >= amount) {
      set((s) => ({ energy: s.energy - amount }))
      return true
    }
    return false
  },

  // Active Pro Plan state
  proPlan: {
    id: 3,
    name: 'Monthly Pro',
    period: '30 days',
    expiresAt: '24 days left',
    color: '#229ED9',
    noWatermarkLimit: 200,
    noWatermarkUsed: 28,
    withWatermarkLimit: 'unlimited',
    withWatermarkUsed: 45,
    aiGenerationsLimit: 50,
    aiGenerationsUsed: 12,
    dailySpinsBonus: 10,
    bonusEnergy: 300,
  },
  setProPlan: (plan) => set({ proPlan: plan }),

  // Free AI generations (limit of 2 daily free, then 5 energy each)
  freeAiGenerationsUsed: 0,
  consumeAiGeneration: () => {
    const state = get()
    // 1. Free daily generation (first 2)
    if (state.freeAiGenerationsUsed < 2) {
      set({ freeAiGenerationsUsed: state.freeAiGenerationsUsed + 1 })
      return { success: true, isFree: true }
    }

    // 2. Pro plan AI generation quota if active
    if (state.proPlan) {
      const isUnlimited = state.proPlan.aiGenerationsLimit === 'unlimited'
      const hasQuota =
        isUnlimited ||
        (typeof state.proPlan.aiGenerationsLimit === 'number' &&
          state.proPlan.aiGenerationsUsed < state.proPlan.aiGenerationsLimit)
      if (hasQuota) {
        set({
          proPlan: {
            ...state.proPlan,
            aiGenerationsUsed: state.proPlan.aiGenerationsUsed + 1,
          },
        })
        return { success: true, isFree: true }
      }
    }

    // 3. Otherwise costs 5 Energy per generation
    if (state.energy >= 5) {
      set({ energy: state.energy - 5 })
      return { success: true, isFree: false }
    }

    return { success: false, isFree: false, error: 'Insufficient Energy. 5 ⚡ Energy required.' }
  },

  // Bonus watermark-free saves (e.g. from promo codes)
  watermarkFreeSavesBonus: 5,
  addWatermarkFreeBonus: (amount: number) =>
    set((s) => ({ watermarkFreeSavesBonus: s.watermarkFreeSavesBonus + amount })),

  // Watermark-Free Save consumption (costs 5 Energy, uses Pro plan quota, or uses promo bonus)
  consumeWatermarkFreeSave: () => {
    const state = get()

    // 1. Pro plan watermark-free quota if active
    if (state.proPlan) {
      const isUnlimited = state.proPlan.noWatermarkLimit === 'unlimited'
      const hasQuota =
        isUnlimited ||
        (typeof state.proPlan.noWatermarkLimit === 'number' &&
          state.proPlan.noWatermarkUsed < state.proPlan.noWatermarkLimit)
      if (hasQuota) {
        set({
          proPlan: {
            ...state.proPlan,
            noWatermarkUsed: state.proPlan.noWatermarkUsed + 1,
          },
        })
        return { success: true, fromPro: true }
      }
    }

    // 2. Bonus saves from promo code
    if (state.watermarkFreeSavesBonus > 0) {
      set({ watermarkFreeSavesBonus: state.watermarkFreeSavesBonus - 1 })
      return { success: true, fromPro: false }
    }

    // 3. Costs 5 Energy per save
    if (state.energy >= 5) {
      set({ energy: state.energy - 5 })
      return { success: true, fromPro: false }
    }

    return { success: false, fromPro: false, error: 'Insufficient Energy or Saves. 5 ⚡ Energy required.' }
  },

  topupOpen: false,
  topupTab: 'stars',
  openTopup: (tab?: TopupTab) => set({ topupOpen: true, topupTab: tab ?? 'stars' }),
  closeTopup: () => set({ topupOpen: false }),

  settingsOpen: false,
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),

  // Settings state
  language: 'EN',
  setLanguage: (lang: 'RU' | 'EN' | 'ZH') => set({ language: lang }),
  hapticFeedback: true,
  toggleHapticFeedback: () => set((state) => ({ hapticFeedback: !state.hapticFeedback })),
}))
