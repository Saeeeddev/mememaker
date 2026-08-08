import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { AnimatePresence, motion } from 'framer-motion'

export function AppShell() {
  const location = useLocation()

  return (
    <div className="min-h-dvh bg-[#000000] text-white overflow-hidden flex flex-col relative">
      <main className="flex-1 overflow-y-auto pb-[calc(7rem+env(safe-area-inset-bottom))] pt-4 px-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-md mx-auto w-full min-h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      <BottomNav />
    </div>
  )
}
