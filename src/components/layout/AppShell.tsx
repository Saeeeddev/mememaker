import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <div className="min-h-dvh bg-[#000000] text-white overflow-hidden flex flex-col relative">
      <main className="flex-1 overflow-y-auto pb-[calc(7rem+env(safe-area-inset-bottom))] pt-[calc(3.5rem+env(safe-area-inset-top))] px-4 custom-scrollbar">
        <div className="max-w-md mx-auto w-full min-h-full">
          <Outlet />
        </div>
      </main>
      
      <BottomNav />
    </div>
  )
}
