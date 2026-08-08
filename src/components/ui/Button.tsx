import { type ButtonHTMLAttributes } from 'react'
import { cn } from '@utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-2xl font-semibold transition-all duration-200 active:scale-95',
        variant === 'primary' && 'bg-violet-600 text-white hover:bg-violet-500',
        variant === 'ghost' && 'text-white/70 hover:text-white hover:bg-white/10',
        variant === 'outline' && 'border border-white/20 text-white hover:bg-white/10',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-5 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
