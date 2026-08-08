import { useTasks } from '@hooks/useTasks'
import { TaskList } from '@components/tasks/TaskList'
import { TasksSkeleton } from '@components/skeletons/TasksSkeleton'
import { ClipboardList, ChevronDown } from 'lucide-react'

export function Tasks() {
  const { tasks, loading } = useTasks()

  if (loading) return <TasksSkeleton />

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="pb-10">
      {/* Header section matching TasksPage.png */}
      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Tasks</h1>
        <div className="flex items-center gap-2 bg-[#2a2a3c] rounded-full px-4 py-1.5 cursor-pointer">
          <span className="text-amber-500 font-bold">{completedCount}/{tasks.length}</span>
          <span className="text-white/60 text-sm">completed</span>
          <ChevronDown className="w-4 h-4 text-white/40 ml-1" />
        </div>
      </div>

      <div className="px-2">
        <TaskList tasks={tasks} />
      </div>
    </div>
  )
}

export default Tasks
