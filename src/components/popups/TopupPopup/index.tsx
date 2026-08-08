import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@store/useAppStore'
import { StarsTab } from './StarsTab'
import { TonTab } from './TonTab'
import gramDiamondMark from '@assets/icons/GramDiamondMark.png'

export const TopupPopup = () => {
  const { topupOpen, closeTopup, topupTab, openTopup } = useAppStore()

  return (
    <AnimatePresence>
      {topupOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTopup}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-black rounded-t-[34px] border-t border-white/10 shadow-2xl z-50 pt-5 flex flex-col overflow-hidden"
          >
            {/* Handle */}
            <div className="w-[60px] h-1.5 bg-white/35 rounded-full mx-auto mb-7" />

            {/* Tabs */}
            <div className="flex items-center justify-center gap-16 px-12 border-b border-white/10 mb-7">
              <button 
                onClick={() => openTopup('stars')}
                className={`flex items-center gap-2 pb-4 px-2 relative ${topupTab === 'stars' ? 'text-white' : 'text-white/45'}`}
              >
                <span className="text-[#f3a522] drop-shadow-[0_0_8px_rgba(243,165,34,0.65)]">⭐</span>
                <span className="font-bold text-[15px]">Stars</span>
                {topupTab === 'stars' && (
                  <motion.div layoutId="topupTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#229ED9] rounded-t-full shadow-[0_0_14px_rgba(34,158,217,0.95)]" />
                )}
              </button>

              <button 
                onClick={() => openTopup('ton')}
                className={`flex items-center gap-2 pb-4 px-2 relative ${topupTab === 'ton' ? 'text-white' : 'text-white/45'}`}
              >
                <img src={gramDiamondMark} alt="" className={`h-[17px] w-[17px] object-contain ${topupTab === 'ton' ? 'brightness-0 invert' : 'opacity-45 grayscale'}`} />
                <span className="font-bold text-[15px]">TON</span>
                {topupTab === 'ton' && (
                  <motion.div layoutId="topupTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#229ED9] rounded-t-full shadow-[0_0_14px_rgba(34,158,217,0.95)]" />
                )}
              </button>

            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {topupTab === 'stars' && <StarsTab />}
              {topupTab === 'ton' && <TonTab />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
