import type { Task } from '@/types/task'
import { TaskCard } from './TaskCard'
import { useTranslation } from 'react-i18next'

interface TaskListProps {
  tasks: Task[]
  onTaskAction?: (task: Task) => void
}

export function TaskList({ tasks, onTaskAction }: TaskListProps) {
  const { t } = useTranslation()
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-white/40">
        {t('tasks.no_tasks')}
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
