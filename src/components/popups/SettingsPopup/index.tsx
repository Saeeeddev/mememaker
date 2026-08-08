import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, Smartphone } from 'lucide-react'
import { useAppStore } from '@store/useAppStore'

export const SettingsPopup = () => {
  const { settingsOpen, closeSettings, language, setLanguage, hapticFeedback, toggleHapticFeedback } = useAppStore()

  const languages: ('RU' | 'EN' | 'ZH')[] = ['RU', 'EN', 'ZH']

  return (
    <AnimatePresence>
      {settingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-black rounded-t-3xl z-50 pb-8 pt-4 px-4 border-t border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-8" /> {/* Spacer */}
              <h2 className="text-white font-bold text-xl">Settings</h2>
              <button 
                onClick={closeSettings}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Language Row */}
              <div className="bg-[#151522] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="text-[#229ED9]" size={20} />
                  <span className="text-white font-medium">Language</span>
                </div>
                
                <div className="flex items-center bg-black rounded-xl p-1">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${
                        language === lang 
                          ? 'bg-[#229ED9] text-white' 
                          : 'text-white/50 hover:text-white/80'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Haptic Feedback Row */}
              <div className="bg-[#151522] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="text-[#ff9f0a]" size={20} />
                  <span className="text-white font-medium">Haptic Feedback</span>
                </div>
                
                {/* Toggle Switch */}
                <button 
                  onClick={toggleHapticFeedback}
                  className={`w-[52px] h-[32px] rounded-full p-1 transition-colors duration-300 ease-in-out ${
                    hapticFeedback ? 'bg-[#34c759]' : 'bg-white/20'
                  }`}
                >
                  <motion.div 
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-[24px] h-[24px] bg-white rounded-full shadow-md"
                    style={{
                      transform: hapticFeedback ? 'translateX(20px)' : 'translateX(0px)'
                    }}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
