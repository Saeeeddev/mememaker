import { useAppStore } from '@store/useAppStore'

export function useUser() {
  const user = useAppStore((s) => s.user)
  return { user }
}
