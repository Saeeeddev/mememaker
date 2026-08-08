import { Clock3 } from 'lucide-react'

export const MyMemes = () => {
  return (
    <div className="bg-[#141416] rounded-[18px] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[15.5px] font-bold text-white">Meme Created History</span>
        <span className="text-[13px] text-[#8a8f98] flex items-center gap-1">
          0 memes
        </span>
      </div>

      {/* History Button */}
      <div className="flex">
        <div className="w-full h-[92px] rounded-[14px] bg-[#1c1c1e] flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-white/10 transition-colors">
          <Clock3 size={18} className="text-[#8a8f98]" />
          <span className="text-[12.5px] text-[#8a8f98]">History</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3.5">
        <span className="text-[13.5px] text-[#8a8f98]">No memes created yet</span>
        <button className="text-[13.5px] text-[#229ED9] font-semibold hover:text-[#2AABEE] transition-colors">
          Create Meme ›
        </button>
      </div>
    </div>
  )
}
