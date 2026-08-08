import { useAppStore } from '@store/useAppStore'

export function useTopup() {
  const { topupOpen, topupTab, openTopup, closeTopup } = useAppStore()
  return { topupOpen, topupTab, openTopup, closeTopup }
}
