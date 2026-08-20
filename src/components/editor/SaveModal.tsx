import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Download, Sparkles, Crown, Droplets, Zap } from 'lucide-react'
import starsIcon from '@assets/icons/Stars.webp'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@store/useAppStore'
import { useNavigate } from 'react-router-dom'
import { WebApp } from '@utils/telegram'

interface SaveModalProps {
  open: boolean
  onClose: () => void
  onSaveOption: (option: 'free' | 'ads' | 'unwatermarked') => void
}

export function SaveModal({ open, onClose, onSaveOption }: SaveModalProps) {
  const { t } = useTranslation()
  const { energy, stars, proPlan, watermarkFreeSavesBonus, consumeWatermarkFreeSave } = useAppStore()
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Calculate total watermark-free saves left across Pro plan and Promo bonus
  const isProUnlimited = proPlan?.noWatermarkLimit === 'unlimited'
  const proQuotaLeft = isProUnlimited
    ? Infinity
    : Math.max(0, ((proPlan?.noWatermarkLimit as number) || 0) - (proPlan?.noWatermarkUsed || 0))
  const totalWatermarkFreeLeft = isProUnlimited
    ? '∞ Unlimited'
    : (proPlan ? proQuotaLeft : 0) + (watermarkFreeSavesBonus || 0)

  const hasFreeSavesAvailable =
    isProUnlimited || (typeof totalWatermarkFreeLeft === 'number' && totalWatermarkFreeLeft > 0)

  const handleUnwatermarkedSave = () => {
    setError(null)
    const result = consumeWatermarkFreeSave()
    if (!result.success) {
      setError(result.error || 'Insufficient Energy or Saves. 5 ⚡ Energy required.')
      try {
        WebApp?.HapticFeedback?.notificationOccurred?.('error')
      } catch {}
      return
    }

    try {
      WebApp?.HapticFeedback?.notificationOccurred?.('success')
    } catch {}
    onSaveOption('unwatermarked')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop (high z-index strictly above BottomNav) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 z-[100] backdrop-blur-sm"
          />

          {/* Popup Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-black rounded-t-[34px] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.85)] z-[100] pt-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] flex flex-col overflow-hidden max-h-[92vh]"
          >
            {/* Handle */}
            <div className="w-[50px] h-1.5 bg-white/30 rounded-full mx-auto mb-3.5 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 mb-2.5 shrink-0">
              <div>
                <h3 className="font-extrabold text-white text-[18px] leading-tight">
                  {t('editor.save_meme', 'Save Meme')}
                </h3>
                <p className="text-[#8a8f98] text-[12px] mt-0.5">
                  {t('editor.choose_how_to_save', 'Select export option & check limits')}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Top Balances & Quota Left Strip */}
            <div className="flex items-center gap-2 px-4 mb-3.5 overflow-x-auto [&::-webkit-scrollbar]:hidden shrink-0">
              {/* Energy pill */}
              <div className="h-8 px-2.5 rounded-[10px] bg-[#141416] border border-white/10 flex items-center gap-1.5 shrink-0 shadow-sm">
                <Zap size={13} className="text-[#2AABEE] fill-[#2AABEE]/30" />
                <span className="text-white font-black text-[12px]">{energy.toLocaleString()} ⚡</span>
              </div>

              {/* Stars pill */}
              <div className="h-8 px-2.5 rounded-[10px] bg-[#141416] border border-white/10 flex items-center gap-1.5 shrink-0 shadow-sm">
                <img src={starsIcon} alt="Stars" className="w-3.5 h-3.5 object-contain" />
                <span className="text-white font-black text-[12px]">{stars.toLocaleString()}</span>
              </div>

              {/* Watermark-Free Quota Pill */}
              <div
                className={`h-8 px-2.5 rounded-[10px] border flex items-center gap-1.5 shrink-0 shadow-sm ${
                  hasFreeSavesAvailable
                    ? 'bg-[#31B57A]/15 border-[#31B57A]/40 text-[#31B57A]'
                    : 'bg-white/5 border-white/10 text-white/50'
                }`}
              >
                <Droplets size={13} className={hasFreeSavesAvailable ? 'text-[#31B57A]' : 'text-white/40'} />
                <span className="font-extrabold text-[11.5px]">
                  {totalWatermarkFreeLeft} Clean Saves
                </span>
              </div>

              {/* Pro badge if active */}
              {proPlan && (
                <div className="h-8 px-2 rounded-[10px] bg-[#f5a623]/20 border border-[#f5a623]/40 flex items-center gap-1 text-[#f5a623] shrink-0 font-black text-[11px] shadow-sm">
                  <Crown size={12} />
                  <span>PRO</span>
                </div>
              )}
            </div>

            {/* Scrollable Options List */}
            <div className="px-4 flex flex-col gap-2.5 overflow-y-auto pb-4">
              {/* Active Plan / Promo Quota Banner */}
              <div className="bg-[#141416] rounded-[18px] p-3.5 border border-[#35363a] flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-[12px] bg-[#1c1c1e] flex items-center justify-center shrink-0 text-[#f5a623]">
                    {proPlan ? <Crown size={18} /> : <Sparkles size={18} className="text-[#56b6ff]" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-white truncate">
                      {proPlan
                        ? `${proPlan.name} Active`
                        : watermarkFreeSavesBonus > 0
                          ? 'Promo Code Bonus Active'
                          : 'Basic Free Tier'}
                    </div>
                    <div className="text-[11.5px] text-[#8a8f98] font-medium truncate">
                      {hasFreeSavesAvailable
                        ? `Available Quota: ${totalWatermarkFreeLeft} watermark-free saves`
                        : `No active bonus • 5 ⚡ Energy required`}
                    </div>
                  </div>
                </div>

                {hasFreeSavesAvailable ? (
                  <span className="bg-[#29a896] px-2.5 py-1 rounded-full text-white font-black text-[11px] shrink-0">
                    {totalWatermarkFreeLeft} LEFT
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      navigate('/shop', { state: { tab: 'energy' } })
                    }}
                    className="bg-[#1f3a52] text-[#56b6ff] px-2.5 py-1 rounded-full font-bold text-[11.5px] shrink-0 hover:brightness-110 cursor-pointer"
                  >
                    + Buy Energy
                  </button>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-[14px] bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center justify-between">
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      navigate('/shop', { state: { tab: 'energy' } })
                    }}
                    className="px-2 py-1 bg-red-500/30 rounded-lg text-white font-bold text-[11px] underline"
                  >
                    Get Energy
                  </button>
                </div>
              )}

              {/* 1. Clean Export (No Watermark) */}
              <div className="bg-[#141416] rounded-[18px] p-4 flex items-center justify-between gap-3 shadow-md border border-white/5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-[46px] h-[46px] rounded-[14px] bg-[#1c1c1e] border border-[#35363a] flex items-center justify-center shrink-0 text-[#31B57A]">
                    <Droplets size={22} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-[15px] font-bold text-white truncate">
                        {t('editor.no_watermark', 'No Watermark')}
                      </h4>
                      {hasFreeSavesAvailable ? (
                        <span className="bg-[#29a896] px-2 py-0.5 rounded-full text-white font-bold text-[10.5px]">
                          Free Quota
                        </span>
                      ) : (
                        <span className="bg-[#1f3a52] px-2 py-0.5 rounded-full text-[#56b6ff] font-bold text-[10.5px]">
                          5 ⚡ Energy
                        </span>
                      )}
                    </div>
                    <p className="text-[#8a8f98] text-[12px] truncate mt-0.5">
                      {hasFreeSavesAvailable
                        ? `Export clean meme using your quota (${totalWatermarkFreeLeft} left)`
                        : `Export clean meme (costs 5 ⚡ Energy)`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUnwatermarkedSave}
                  className="shrink-0 bg-white text-black font-extrabold text-[13.5px] rounded-[12px] px-4 py-2 hover:bg-white/90 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  Save
                </button>
              </div>

              {/* 2. Free Download (With Watermark) */}
              <div className="bg-[#141416] rounded-[18px] p-4 flex items-center justify-between gap-3 shadow-md border border-white/5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-[46px] h-[46px] rounded-[14px] bg-[#1c1c1e] border border-[#35363a] flex items-center justify-center shrink-0 text-white/60">
                    <Download size={22} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-[15px] font-bold text-white truncate">
                        {t('editor.free_download', 'Standard Save')}
                      </h4>
                      <span className="bg-white/10 px-2 py-0.5 rounded-full text-white/60 font-bold text-[10.5px]">
                        Free
                      </span>
                    </div>
                    <p className="text-[#8a8f98] text-[12px] truncate mt-0.5">
                      {t('editor.with_watermark', 'Includes small MemeZone watermark')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSaveOption('free')}
                  className="shrink-0 bg-white/10 hover:bg-white/15 text-white font-bold text-[13.5px] rounded-[12px] px-4 py-2 active:scale-95 transition-all cursor-pointer"
                >
                  Save
                </button>
              </div>

              {/* 3. Watch Ad (Soon) */}
              <div className="bg-[#141416] rounded-[18px] p-4 flex items-center justify-between gap-3 shadow-md opacity-45 select-none">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-[46px] h-[46px] rounded-[14px] bg-[#1c1c1e] border border-[#35363a] flex items-center justify-center shrink-0 text-white/40">
                    <Play size={22} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-[15px] font-bold text-white/60 truncate">
                        {t('editor.watch_ad', 'Watch Ad')}
                      </h4>
                      <span className="bg-[#229ED9] px-2 py-0.5 rounded-full text-white font-black text-[9.5px] uppercase">
                        {t('layout.soon', 'SOON')}
                      </span>
                    </div>
                    <p className="text-[#8a8f98] text-[12px] truncate mt-0.5">
                      {t('editor.with_watermark_support_us', 'Unlock free saves by watching sponsor ads')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled
                  className="shrink-0 bg-white/5 text-white/30 font-bold text-[13.5px] rounded-[12px] px-4 py-2 cursor-not-allowed"
                >
                  {t('layout.soon', 'SOON')}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
