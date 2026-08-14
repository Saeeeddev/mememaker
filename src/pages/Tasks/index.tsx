import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTasks } from '@hooks/useTasks'
import { TaskList } from '@components/tasks/TaskList'
import { TasksSkeleton } from '@components/skeletons/TasksSkeleton'
import { Spinner } from '@components/tasks/Spinner'

export function Tasks() {
  const { tasks, loading } = useTasks()
  const [activeTab, setActiveTab] = useState<'tasks' | 'spinner'>('tasks')

  if (loading) return <TasksSkeleton />

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="pt-2 px-1 pb-24">
      {/* Page Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-[24px] font-extrabold text-white">Earn</h1>
        {activeTab === 'tasks' && (
          <div className="rounded-full bg-[#f5a623] px-3 py-1 text-[13px] font-extrabold text-white leading-none">
            {completedCount}/{tasks.length}
          </div>
        )}
      </div>

      {/* Custom Tabs */}
      <div className="flex gap-4 mb-6 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`relative pb-2 text-[16px] font-bold transition-colors ${
            activeTab === 'tasks' ? 'text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          Tasks
          {activeTab === 'tasks' && (
            <motion.div
              layoutId="tasks-tab-indicator"
              className="absolute bottom-[-9px] left-0 right-0 h-[3px] bg-[#229ED9] rounded-t-full"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('spinner')}
          className={`relative pb-2 text-[16px] font-bold transition-colors ${
            activeTab === 'spinner' ? 'text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          Spinner
          {activeTab === 'spinner' && (
            <motion.div
              layoutId="tasks-tab-indicator"
              className="absolute bottom-[-9px] left-0 right-0 h-[3px] bg-[#229ED9] rounded-t-full"
            />
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'tasks' ? (
        <TaskList tasks={tasks} />
      ) : (
        <Spinner />
      )}
    </div>
  )
}

export default Tasks
