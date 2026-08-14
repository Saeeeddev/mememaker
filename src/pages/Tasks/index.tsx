import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTasks } from '@hooks/useTasks'
import { TaskList } from '@components/tasks/TaskList'
import { TasksSkeleton } from '@components/skeletons/TasksSkeleton'
import { Spinner } from '@components/tasks/Spinner'
import { WatchAds } from '@components/tasks/WatchAds'

import tasksBtnImg from '@assets/images/TasksButton.webp'
import watchAdsBtnImg from '@assets/images/WatchAddsMain.webp'
import dailySpinBtnImg from '@assets/images/DailySpinButton.webp'

type Tab = 'earn' | 'ads' | 'spinner' | 'tasks'

export function Tasks() {
  const { tasks, loading } = useTasks()
  const location = useLocation()
  
  // Default to 'earn' menu unless specific tab requested via state
  const initialTab = location.state?.tab === 'spinner' ? 'spinner' : 'earn'
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  if (loading) return <TasksSkeleton />

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="pt-2 px-1 pb-24">
      {/* Page Header */}
      <div className="mb-4 flex items-center justify-between px-2">
        <h1 className="text-[28px] font-black text-white italic">EARN</h1>
        {activeTab === 'tasks' && (
          <div className="rounded-full bg-gradient-to-r from-[#f5a623] to-[#f8cd46] px-4 py-1 text-[13px] font-black text-[#1a1a1a] shadow-[0_2px_8px_rgba(245,166,35,0.4)]">
            {completedCount}/{tasks.length}
          </div>
        )}
      </div>

      {/* Custom Tabs (Hidden on main menu) */}
      {activeTab !== 'earn' && (
        <div className="flex gap-1 mb-6 bg-white/5 p-1.5 rounded-[20px] mx-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {['ads', 'spinner', 'tasks'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as Tab)}
              className={`relative px-4 py-2.5 text-[14px] font-bold rounded-[14px] whitespace-nowrap transition-colors flex-1 z-10 ${
                activeTab === tab ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="tasks-tab-indicator"
                  className="absolute inset-0 bg-[#229ED9] rounded-[14px] -z-10 shadow-[0_2px_10px_rgba(34,158,217,0.4)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              {tab === 'ads' ? 'Watch Ads' : tab === 'spinner' ? 'Spinner' : 'Tasks'}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'earn' && (
        <div className="flex flex-col gap-5 mt-8 px-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('ads')}
            className="w-full focus:outline-none rounded-3xl"
          >
            <img src={watchAdsBtnImg} alt="Watch Ads" className="w-full h-auto object-contain" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('spinner')}
            className="w-full focus:outline-none rounded-3xl"
          >
            <img src={dailySpinBtnImg} alt="Daily Spin" className="w-full h-auto object-contain" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('tasks')}
            className="w-full focus:outline-none rounded-3xl"
          >
            <img src={tasksBtnImg} alt="Tasks" className="w-full h-auto object-contain" />
          </motion.button>
        </div>
      )}

      {activeTab === 'ads' && <WatchAds />}

      {activeTab === 'tasks' && <TaskList tasks={tasks} />}
      {activeTab === 'spinner' && <Spinner />}
    </div>
  )
}

export default Tasks
