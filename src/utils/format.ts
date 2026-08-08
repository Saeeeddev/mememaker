export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function formatTon(amount: number): string {
  return `${amount.toFixed(2)} TON`
}

export function formatStars(amount: number): string {
  return `⭐ ${formatNumber(amount)}`
}
