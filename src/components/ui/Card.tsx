import { cn } from '@utils/cn'
import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-4',
        onClick && 'cursor-pointer hover:bg-white/10 transition-colors duration-200',
        className,
      )}
    >
      {children}
    </div>
  )
}
