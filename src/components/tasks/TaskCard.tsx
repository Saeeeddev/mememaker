import type { Task } from '@/types/task'
import gramDiamondMark from '@assets/icons/GramDiamondMark.png'

interface TaskCardProps {
  task: Task
  onAction?: (task: Task) => void
}

export function TaskCard({ task, onAction }: TaskCardProps) {
  const taskIcon = task.id === '1' ? '🪄' : task.id === '2' ? '🐰' : '🏙️'

  return (
    <div className="flex items-center gap-3 bg-[#141416] border border-white/8 rounded-[18px] px-3 py-3 min-h-[78px] shadow-[0_10px_24px_rgba(0,0,0,0.2)]">
      {/* Icon Area */}
      <div className={`w-[48px] h-[48px] rounded-[14px] flex items-center justify-center shrink-0 overflow-hidden ${
        task.id === '1'
          ? 'bg-[#052d49] border border-[#229ED9]'
          : task.id === '2'
            ? 'bg-[#101010]'
            : 'bg-[#12364a]'
      }`}>
        {task.icon ? (
          <img src={task.icon} alt={task.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[24px] leading-none">{taskIcon}</span>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <h3 className="font-extrabold text-white text-[15px] leading-[17px] line-clamp-2">{task.title}</h3>
        <p className="text-[#7f8790] text-[12.5px] leading-[15px] truncate mt-0.5">{task.description}</p>
        <div className="mt-0.5 flex items-center gap-1 text-xs">
          <span className="text-[#00f0b5] font-extrabold">+{task.reward} {task.rewardType.toUpperCase()}</span>
          {task.rewardType === 'ton' && (
            <img src={gramDiamondMark} alt="" className="h-3 w-3 object-contain" />
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onAction?.(task)}
        disabled={task.completed}
        className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
          task.completed
            ? 'bg-white/10 text-white/40'
            : 'bg-[#172d42] text-[#2AABEE] border border-[#229ED9]/75 hover:bg-[#1c3852]'
        }`}
      >
        {task.completed ? 'Done' : 'Go'}
      </button>
    </div>
  )
}
