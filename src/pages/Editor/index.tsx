import { useState, useEffect } from 'react'
import { EditorSkeleton } from '@components/skeletons/EditorSkeleton'

export function Editor() {
  const [loading, setLoading] = useState(true)

  // Simulate loading for the skeleton to show
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="h-[calc(100vh-100px)] pt-4 px-2 bg-[#000000]">
        <EditorSkeleton />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] pt-4 px-2 bg-[#000000]">
      {/* Canvas Area Placeholder */}
      <div className="w-full aspect-square bg-[#2C2C2E] rounded-2xl border border-white/10 shrink-0 flex items-center justify-center">
        <span className="text-white/40">Canvas Area</span>
      </div>
      
      {/* Toolbar Placeholder */}
      <div className="h-14 bg-[#141416] rounded-xl border border-white/10 w-full mt-4 flex items-center justify-center">
        <span className="text-white/40 text-sm">Toolbar</span>
      </div>
      
      <div className="flex-1" />
      
      <div className="space-y-3 pb-8 mt-4">
        <button className="w-full py-3 bg-[#229ED9] hover:bg-[#2AABEE] rounded-xl font-bold transition-colors">
          Generate Meme
        </button>
        <button className="w-full py-3 bg-[#141416] rounded-xl font-bold text-white/80">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default Editor
