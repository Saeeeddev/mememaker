import { motion } from 'framer-motion'
import { Play, Zap, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function WatchAds() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center pt-4 px-4 text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-[#1c1c1e] rounded-3xl p-6 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-[#3a7bf5] to-[#1242b5] rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(58,123,245,0.4)]">
          <Play className="w-10 h-10 text-white ml-2" fill="currentColor" />
        </div>
        
        <h2 className="text-2xl font-black text-white italic mb-2">{t('tasks.watch_ads_title', 'Watch & Earn')}</h2>
        <p className="text-white/60 font-medium mb-8 text-[14px]">
          {t('tasks.watch_ads_desc', 'Watch short video ads to earn free Energy and Stars')}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col items-center">
            <Zap className="w-8 h-8 text-[#2AABEE] mb-2 fill-[#2AABEE]/30" />
            <div className="text-white font-black text-lg">+15⚡</div>
            <div className="text-white/40 text-xs font-bold uppercase tracking-wider">{t('shop.energy', 'Energy')}</div>
          </div>
          <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col items-center">
            <Star className="w-8 h-8 text-[#f5a623] mb-2" fill="currentColor" />
            <div className="text-white font-black text-lg">+5⭐</div>
            <div className="text-white/40 text-xs font-bold uppercase tracking-wider">{t('tasks.stars', 'Stars')}</div>
          </div>
        </div>

        <button
          disabled
          className="w-full py-4 rounded-2xl font-black text-lg text-white/70 bg-[#229ED9]/40 border border-[#229ED9]/30 shadow-none cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span>{t('tasks.watch_video', 'Watch Video')}</span>
          <span className="px-2 py-0.5 rounded-full bg-[#229ED9] text-white text-[10px] font-black uppercase">
            {t('layout.soon', 'SOON')}
          </span>
        </button>
      </motion.div>
    </div>
  )
}
