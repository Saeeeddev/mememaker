import { motion } from 'framer-motion'
import { Play, Coins, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function WatchAds() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center pt-8 px-4 text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-[#1c1c1e] rounded-3xl p-6 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-[#3a7bf5] to-[#1242b5] rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(58,123,245,0.4)]">
          <Play className="w-10 h-10 text-white ml-2" fill="currentColor" />
        </div>
        
        <h2 className="text-2xl font-black text-white italic mb-2">{t('tasks.watch_ads_title')}</h2>
        <p className="text-white/60 font-medium mb-8">
          {t('tasks.watch_ads_desc')}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
            <Coins className="w-8 h-8 text-[#f5a623] mx-auto mb-2" />
            <div className="text-white font-black text-lg">+100</div>
            <div className="text-white/40 text-xs font-bold">{t('tasks.coins')}</div>
          </div>
          <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
            <Star className="w-8 h-8 text-[#e49b1a] mx-auto mb-2" fill="currentColor" />
            <div className="text-white font-black text-lg">+5</div>
            <div className="text-white/40 text-xs font-bold">{t('tasks.stars')}</div>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-[#229ED9] to-[#2ab6f6] shadow-[0_4px_15px_rgba(34,158,217,0.4)]"
        >
          {t('tasks.watch_video')}
        </motion.button>
      </motion.div>
    </div>
  )
}
