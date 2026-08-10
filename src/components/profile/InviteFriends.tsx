import { useState } from 'react'
import { ChevronRight, ChevronDown, Copy, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const InviteFriends = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mt-4 bg-[#141416] rounded-[18px] p-4">
      {/* Header (always visible) */}
      <div 
        className={`flex items-center justify-between cursor-pointer transition-colors ${expanded ? 'mb-3.5' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl">💸</span>
          <span className="text-[15.5px] font-bold text-white">Invite friends</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="bg-[#29a896] px-2.5 py-0.5 rounded-full text-white font-bold text-[13px]">
            10%
          </div>
          {expanded ? (
            <ChevronDown size={18} className="text-[#8a8f98]" />
          ) : (
            <ChevronRight size={18} className="text-[#8a8f98]" />
          )}
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3.5">
              {/* Description */}
              <p className="text-[#8a8f98] text-[14px] leading-relaxed">
                Invite referrals and get <span className="bg-[#1f3a52] px-2 py-0.5 rounded-full text-[#56b6ff] font-bold text-[12.5px] mx-1">10%</span> from their Stars deposits
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 bg-white text-black font-semibold text-[14px] rounded-[14px] py-2.5 hover:bg-white/90 transition-colors">
                  Invite friends
                </button>
                <button className="w-[48px] bg-white/5 flex items-center justify-center rounded-[14px] hover:bg-white/10 transition-colors text-white">
                  <Copy size={18} />
                </button>
              </div>

              {/* Stats Box */}
              <div className="bg-[#1c1c1e] rounded-[14px] p-4 flex flex-col gap-3.5 border border-[#35363a]">
                <div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-white font-bold text-2xl">0</span>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="#F5A623" className="mb-1">
                      <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.6 5.9 21l1.5-6.8-5.2-4.7 6.9-.7L12 2.5z" />
                    </svg>
                  </div>
                  <span className="text-[#8a8f98] text-[13px]">Stars available</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-0.5">
                  <div className="bg-white/5 rounded-[12px] p-3 flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-1.5 text-white font-bold text-lg">
                      0 <Users size={15} />
                    </div>
                    <span className="text-[#8a8f98] text-[12px]">Invited</span>
                  </div>
                  <div className="bg-white/5 rounded-[12px] p-3 flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-1.5 text-white font-bold text-lg">
                      0
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623">
                        <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.6 5.9 21l1.5-6.8-5.2-4.7 6.9-.7L12 2.5z" />
                      </svg>
                    </div>
                    <span className="text-[#8a8f98] text-[12px]">Stars earned</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
