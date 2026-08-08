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
      <div className="h-[calc(100vh-100px)] pt-4 px-2">
        <EditorSkeleton />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] pt-4 px-2">
      {/* Canvas Area Placeholder */}
      <div className="w-full aspect-square bg-[#1a1a2e] rounded-2xl border border-white/10 shrink-0 flex items-center justify-center">
        <span className="text-white/40">Canvas Area</span>
      </div>
      
      {/* Toolbar Placeholder */}
      <div className="h-14 bg-[#1a1a2e] rounded-xl border border-white/10 w-full mt-4 flex items-center justify-center">
        <span className="text-white/40 text-sm">Toolbar</span>
      </div>
      
      <div className="flex-1" />
      
      <div className="space-y-3 pb-8 mt-4">
        <button className="w-full py-3 bg-blue-600 rounded-xl font-bold">
          Generate Meme
        </button>
        <button className="w-full py-3 bg-white/10 rounded-xl font-bold text-white/80">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default Editor
