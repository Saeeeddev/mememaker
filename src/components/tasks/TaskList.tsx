import type { Task } from '@/types/task'
import { TaskCard } from './TaskCard'

interface TaskListProps {
  tasks: Task[]
  onTaskAction?: (task: Task) => void
}

export function TaskList({ tasks, onTaskAction }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-white/40">
        No tasks available
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onAction={onTaskAction} />
      ))}
    </div>
  )
}
