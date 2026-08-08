import { type ReactNode, useState } from 'react'
import { cn } from '@utils/cn'

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  children: (activeId: string) => ReactNode
  defaultTab?: string
  className?: string
}

export function Tabs({ tabs, children, defaultTab, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id)

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex gap-1 rounded-2xl bg-white/10 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              'flex-1 rounded-xl py-2 text-sm font-medium transition-all duration-200',
              active === tab.id
                ? 'bg-white text-black shadow'
                : 'text-white/60 hover:text-white',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children(active)}
    </div>
  )
}
