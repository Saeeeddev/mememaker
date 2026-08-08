import { cn } from '@utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-white/10 text-white/80',
        variant === 'success' && 'bg-emerald-500/20 text-emerald-400',
        variant === 'warning' && 'bg-amber-500/20 text-amber-400',
        variant === 'info' && 'bg-violet-500/20 text-violet-300',
        className,
      )}
    >
      {children}
    </span>
  )
}
