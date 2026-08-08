import WebApp from '@twa-dev/sdk'

/**
 * Initialize Telegram Mini App.
 * Safely handles running outside Telegram (dev mode in browser).
 */
export function initTelegram() {
  try {
    if (typeof WebApp?.ready === 'function') {
      WebApp.ready()
    }
    if (typeof WebApp?.expand === 'function') {
      WebApp.expand()
    }
  } catch (e) {
    console.warn('[Telegram] SDK init skipped — not running inside Telegram:', e)
  }
}

/** Get Telegram user from init data */
export function getTelegramUser() {
  try {
    return WebApp?.initDataUnsafe?.user ?? null
  } catch {
    return null
  }
}

export { WebApp }
