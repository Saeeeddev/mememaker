import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@store/useAppStore'
import { StarsTab } from './StarsTab'
import { useTranslation } from 'react-i18next'

export const TopupPopup = () => {
  const { topupOpen, closeTopup } = useAppStore()
  const { t } = useTranslation()

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
            <div className="w-[60px] h-1.5 bg-white/35 rounded-full mx-auto mb-5" />

            {/* Title */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-[#f3a522] drop-shadow-[0_0_8px_rgba(243,165,34,0.65)] text-xl"></span>
              <span className="font-bold text-white text-[17px]">{t('popups.top_up_stars')}</span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <StarsTab />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
