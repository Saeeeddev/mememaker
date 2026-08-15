import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <div className="fixed inset-0 bg-[#000000] text-white overflow-hidden flex flex-col">
      <main id="main-scroll-container" className="flex-1 overflow-y-auto pb-[calc(7rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] px-4 custom-scrollbar">
        <div className="max-w-md mx-auto w-full min-h-full">
          <Outlet />
        </div>
      </main>
      
      <BottomNav />
    </div>
  )
}
