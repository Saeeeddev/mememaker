import { useTasks } from '@hooks/useTasks'
import { TaskList } from '@components/tasks/TaskList'
import { TasksSkeleton } from '@components/skeletons/TasksSkeleton'

export function Tasks() {
  const { tasks, loading } = useTasks()

  if (loading) return <TasksSkeleton />

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="pt-2">
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          
          <h1 className="text-[24px] font-extrabold text-white">Tasks</h1>
        </div>

        <div className="rounded-full bg-[#f5a623] px-3 py-1 text-[13px] font-extrabold text-white leading-none">
          {completedCount}/{tasks.length}
        </div>
      </div>

      <TaskList tasks={tasks} />
    </div>
  )
}

export default Tasks
