import type { Task } from '@/types/task'
import starsIcon from '@assets/icons/Stars.webp'
import { useTranslation } from 'react-i18next'
import { Check, Zap } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onAction?: (task: Task) => void
}

export function TaskCard({ task, onAction }: TaskCardProps) {
  const { t, i18n } = useTranslation()
  const taskIcon = task.id === '1' ? '🪄' : task.id === '2' ? '🐰' : '🏙️'
  const isEnergy = task.rewardType === 'energy'

  return (
    <div className="bg-[#141416] rounded-[18px] p-4 flex items-center justify-between gap-3 shadow-md">
      {/* Icon Area */}
      <div className="w-[46px] h-[46px] rounded-[14px] bg-[#1c1c1e] border border-[#35363a] flex items-center justify-center shrink-0 overflow-hidden">
        {task.icon ? (
          <img src={task.icon} alt={task.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[22px] leading-none">{taskIcon}</span>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-white text-[15.5px] leading-tight truncate">
          {i18n.language === 'ru' ? (task.title_ru || task.title) : task.title}
        </h3>
        <p className="text-[#8a8f98] text-[12.5px] truncate mt-0.5">
          {i18n.language === 'ru' ? (task.description_ru || task.description) : task.description}
        </p>

        {/* Reward Pill (Profile style) */}
        <div className="mt-1.5 flex items-center gap-1.5">
          {isEnergy ? (
            <span className="bg-[#1f3a52] px-2.5 py-0.5 rounded-full text-[#56b6ff] font-bold text-[11.5px] flex items-center gap-1 leading-none">
              <Zap size={11} className="fill-[#56b6ff]/30" /> +{task.reward} {t('shop.energy', 'Energy')}
            </span>
          ) : (
            <span className="bg-[#f5a623]/20 border border-[#f5a623]/40 text-[#f5a623] px-2 py-0.5 rounded-full font-bold text-[11.5px] flex items-center gap-1 leading-none">
              <img src={starsIcon} alt="Stars" className="w-3 h-3 object-contain" /> +{task.reward} {t('tasks.stars', 'Stars')}
            </span>
          )}
        </div>
      </div>

      {/* Action Button (Profile style) */}
      <button
        type="button"
        onClick={() => onAction?.(task)}
        disabled={task.completed}
        className={`shrink-0 rounded-[12px] text-[13.5px] font-extrabold transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
          task.completed
            ? 'bg-white/10 text-white/40 px-3.5 py-2 cursor-default shadow-none'
            : 'bg-white text-black px-4 py-2 hover:bg-white/90 active:scale-95'
        }`}
      >
        {task.completed ? (
          <>
            <Check size={14} strokeWidth={3} className="text-[#31B57A]" />
            <span>{t('tasks.done')}</span>
          </>
        ) : (
          <span>{t('tasks.go')}</span>
        )}
      </button>
    </div>
  )
}
