import { useEffect } from 'react'
import { useAppStore } from '@store/useAppStore'
import { initTelegram, getTelegramUser, WebApp } from '@utils/telegram'
import type { TelegramUser } from '@/types/telegram'

export function useTelegram() {
  const setUser = useAppStore((s) => s.setUser)

  useEffect(() => {
    initTelegram()
    const tgUser = getTelegramUser()
    if (tgUser) {
      setUser(tgUser as TelegramUser)
    }
  }, [setUser])

  return {
    webApp: WebApp,
    haptic: WebApp?.HapticFeedback ?? null,
    colorScheme: WebApp?.colorScheme ?? 'dark',
    platform: WebApp?.platform ?? 'unknown',
  }
}
