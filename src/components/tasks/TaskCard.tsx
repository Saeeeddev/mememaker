import type { Task } from '@/types/task'

interface TaskCardProps {
  task: Task
  onAction?: (task: Task) => void
}

export function TaskCard({ task, onAction }: TaskCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4">
      {/* Icon Area */}
      <div className="w-12 h-12 rounded-xl bg-[#2a2a3c] flex items-center justify-center shrink-0 overflow-hidden">
        {task.icon ? (
          <img src={task.icon} alt={task.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-blue-500" />
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate text-sm">{task.title}</h3>
        <p className="text-white/40 text-xs truncate mt-0.5">{task.description}</p>
        <div className="mt-1 flex items-center gap-1 text-xs">
          <span className="text-amber-500 font-medium">+{task.reward} {task.rewardType.toUpperCase()}</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onAction?.(task)}
        disabled={task.completed}
        className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
          task.completed
            ? 'bg-white/10 text-white/40'
            : 'bg-amber-500 text-white hover:bg-amber-600'
        }`}
      >
        {task.completed ? 'Done' : 'Go'}
      </button>
    </div>
  )
}
