import { create } from 'zustand'
import type { TelegramUser } from '@/types/telegram'

type TopupTab = 'stars' | 'ton'

interface AppState {
  // Telegram user
  user: TelegramUser | null
  setUser: (user: TelegramUser | null) => void

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

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  topupOpen: false,
  topupTab: 'stars',
  openTopup: (tab = 'stars') => set({ topupOpen: true, topupTab: tab }),
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
