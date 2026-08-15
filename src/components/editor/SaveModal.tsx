import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Crown, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SaveModalProps {
  open: boolean
  onClose: () => void
  onSaveOption: (option: 'free' | 'ads' | 'pro') => void
}

export function SaveModal({ open, onClose, onSaveOption }: SaveModalProps) {
  const { t } = useTranslation()
  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-4 right-4 top-1/2 -translate-y-1/2 bg-[#1c1c1e] rounded-[24px] border border-white/10 p-5 z-[75] shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-white font-bold text-[18px]">{t('editor.save_meme')}</h3>
                <p className="text-white/40 text-[13px]">{t('editor.choose_how_to_save')}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Free Option */}
              <button 
                onClick={() => onSaveOption('free')}
                className="w-full flex items-center p-4 rounded-[16px] bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all text-left relative group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 transition-transform">
                  <Download size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-bold text-[15px]">{t('editor.free_download')}</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/60 text-[10px] font-bold uppercase tracking-wider">{t('editor.limited')}</span>
                  </div>
                  <p className="text-white/40 text-[12px]">{t('editor.with_watermark')}</p>
                </div>
              </button>

              {/* Watch Ad Option */}
              <button 
                onClick={() => onSaveOption('ads')}
                className="w-full flex items-center p-4 rounded-[16px] bg-[#229ED9]/10 border border-[#229ED9]/30 hover:bg-[#229ED9]/20 hover:border-[#229ED9]/50 transition-all text-left relative group"
              >
                <div className="w-10 h-10 rounded-full bg-[#229ED9]/20 flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 transition-transform">
                  <Play size={20} className="text-[#229ED9]" fill="currentColor" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-bold text-[15px]">{t('editor.watch_ad')}</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#229ED9]/20 text-[#229ED9] text-[10px] font-bold uppercase tracking-wider">{t('editor.unlimited')}</span>
                  </div>
                  <p className="text-white/40 text-[12px]">{t('editor.with_watermark_support_us')}</p>
                </div>
              </button>

              {/* Pro Option */}
              <button 
                onClick={() => onSaveOption('pro')}
                className="w-full flex items-center p-4 rounded-[16px] bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 hover:border-amber-500/50 transition-all text-left relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 transition-transform relative z-10 shadow-[0_4px_12px_rgba(245,158,11,0.3)]">
                  <Crown size={20} className="text-white" fill="currentColor" />
                </div>
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-bold text-[15px]">{t('editor.pro_version')}</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">{t('editor.premium')}</span>
                  </div>
                  <p className="text-amber-500/60 text-[12px]">{t('editor.no_watermark_high_quality')}</p>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
