import { useState } from 'react'
import { ImagePlus, Layers, History, Zap, Sparkles, Droplets, Wallet, ChevronDown, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@store/useAppStore'
import starsIcon from '@assets/icons/Stars.webp'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { WebApp } from '@utils/telegram'

interface EditorTopBarProps {
  hasTemplate?: boolean
  onAddImage: () => void
  onChangeTemplate: () => void
  onOpenAI?: () => void
  onRecent?: () => void
}

export function EditorTopBar({ hasTemplate = true, onAddImage, onChangeTemplate, onOpenAI, onRecent }: EditorTopBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { energy, stars, proPlan, freeAiGenerationsUsed, watermarkFreeSavesBonus, openTopup } = useAppStore()
  const { t } = useTranslation()
  const navigate = useNavigate()

  // AI calculations
  const freeLeft = Math.max(0, 2 - freeAiGenerationsUsed)
  const isFree = freeLeft > 0
  const hasProQuota = Boolean(
    proPlan &&
      (proPlan.aiGenerationsLimit === 'unlimited' ||
        (typeof proPlan.aiGenerationsLimit === 'number' &&
          proPlan.aiGenerationsUsed < proPlan.aiGenerationsLimit))
  )
  const aiQuotaLeft = proPlan?.aiGenerationsLimit === 'unlimited'
    ? '∞'
    : Math.max(0, ((proPlan?.aiGenerationsLimit as number) || 0) - (proPlan?.aiGenerationsUsed || 0))

  // Watermark calculations
  const noWatermarkUnlimited = proPlan?.noWatermarkLimit === 'unlimited'
  const noWatermarkLeft = noWatermarkUnlimited
    ? '∞'
    : Math.max(0, ((proPlan?.noWatermarkLimit as number) || 0) - (proPlan?.noWatermarkUsed || 0))

  return (
    <div className="px-2 pt-1.5 pb-1 shrink-0 w-full relative">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* Collapsed State: [ Balance ▾ ] + [ Image | Template | Recent ] */
          <motion.div
            key="collapsed-topbar"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 w-full h-10"
          >
            {/* Left: Balance Button */}
            <button
              type="button"
              onClick={() => {
                try {
                  WebApp?.HapticFeedback?.selectionChanged?.()
                } catch {}
                setIsExpanded(true)
              }}
              className="h-10 px-3 rounded-[12px] bg-[#1c1c1e] border border-white/10 text-white hover:bg-white/10 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.3)] shrink-0"
              title={t('editor.balance', 'Balance')}
            >
              <Wallet size={15} className="text-[#229ED9]" />
              <span className="font-bold text-[12.5px]">{t('editor.balance', 'Balance')}</span>
              <ChevronDown size={14} className="text-white/50" />
            </button>

            {/* Right: Tools Container (Add Image, Template, Recent) */}
            <div className="flex-1 min-w-0 h-full flex items-center bg-[#1c1c1e] border border-white/10 rounded-[12px] overflow-hidden">
              <button
                type="button"
                disabled={!hasTemplate}
                onClick={() => {
                  if (!hasTemplate) return
                  try { WebApp?.HapticFeedback?.selectionChanged?.() } catch {}
                  onAddImage()
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 h-full px-1.5 transition-all text-[12px] font-bold min-w-0 ${
                  hasTemplate
                    ? 'text-white/80 hover:text-white hover:bg-white/5 cursor-pointer'
                    : 'text-white/25 opacity-40 cursor-not-allowed'
                }`}
                title={!hasTemplate ? t('editor.choose_to_start', 'Choose a template first') : t('editor.add_image', 'Image')}
              >
                <ImagePlus size={14} className={hasTemplate ? 'text-[#229ED9] shrink-0' : 'text-white/30 shrink-0'} />
                <span className="truncate">{t('editor.add_image', 'Image')}</span>
              </button>

              <div className="w-px h-4.5 bg-white/10 shrink-0" />

              <button
                type="button"
                onClick={() => {
                  try { WebApp?.HapticFeedback?.selectionChanged?.() } catch {}
                  onChangeTemplate()
                }}
                className="flex-1 flex items-center justify-center gap-1.5 h-full px-1.5 text-white/80 hover:text-white hover:bg-white/5 transition-all text-[12px] font-bold min-w-0 cursor-pointer"
              >
                <Layers size={14} className="text-purple-400 shrink-0" />
                <span className="truncate">{t('editor.template', 'Template')}</span>
              </button>

              <div className="w-px h-4.5 bg-white/10 shrink-0" />

              <button
                type="button"
                onClick={() => {
                  try { WebApp?.HapticFeedback?.selectionChanged?.() } catch {}
                  onRecent?.()
                }}
                className="flex-1 flex items-center justify-center gap-1.5 h-full px-1.5 text-white/80 hover:text-white hover:bg-white/5 transition-all text-[12px] font-bold min-w-0 cursor-pointer"
              >
                <History size={14} className="text-green-400 shrink-0" />
                <span className="truncate">{t('editor.recent', 'Recent')}</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* Expanded State: ONE SINGLE UNIFIED BOX across the entire top bar */
          <motion.div
            key="expanded-topbar-single-box"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="w-full h-10 flex items-center justify-between gap-1.5 bg-[#1c1c1e] border border-[#229ED9]/40 rounded-[12px] px-2.5 shadow-[0_2px_12px_rgba(34,158,217,0.25)] overflow-x-auto [&::-webkit-scrollbar]:hidden"
          >
            {/* Left: Balance Label / Collapse trigger */}
            <button
              type="button"
              onClick={() => {
                try { WebApp?.HapticFeedback?.selectionChanged?.() } catch {}
                setIsExpanded(false)
              }}
              className="flex items-center gap-1 px-1 py-1 rounded-[8px] hover:bg-white/5 active:scale-95 transition-all cursor-pointer shrink-0 text-[#229ED9]"
              title={t('editor.balance', '')}
            >
              <Wallet size={14} className="text-[#229ED9] shrink-0" />
              <span className="font-bold text-[12px]">{t('editor.balance', 'Balance')}</span>
              <ChevronDown size={13} className="text-[#229ED9] rotate-180 transition-transform" />
            </button>

            <div className="w-px h-4 bg-white/15 shrink-0" />

            {/* Balances list inside the single unified box */}
            <div className="flex-1 flex items-center justify-around gap-1 min-w-0">
              {/* 1. AI Generation Balance */}
              <button
                type="button"
                onClick={() => {
                  try { WebApp?.HapticFeedback?.selectionChanged?.() } catch {}
                  if (onOpenAI) onOpenAI()
                  else navigate('/shop', { state: { tab: 'pro' } })
                }}
                className="flex items-center gap-1 px-1 py-0.5 rounded-[6px] hover:bg-white/5 active:scale-95 transition-all cursor-pointer shrink-0"
                title={t('editor.ai_gens', 'AI Gens')}
              >
                <Sparkles size={12} className="text-violet-400 shrink-0" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[7.5px] text-white/40 font-semibold uppercase">{t('editor.ai_gens', 'AI')}</span>
                  <span className="text-[10.5px] font-black text-violet-300">
                    {isFree ? `${freeLeft}/2` : hasProQuota ? `${aiQuotaLeft}` : '5⚡'}
                  </span>
                </div>
              </button>

              <div className="w-px h-3.5 bg-white/10 shrink-0" />

              {/* 2. Stars Balance */}
              <button
                type="button"
                onClick={() => {
                  try { WebApp?.HapticFeedback?.selectionChanged?.() } catch {}
                  openTopup('stars')
                }}
                className="flex items-center gap-1 px-1 py-0.5 rounded-[6px] hover:bg-white/5 active:scale-95 transition-all cursor-pointer shrink-0"
                title={t('editor.stars', 'Stars')}
              >
                <img src={starsIcon} alt="Stars" className="w-3 h-3 object-contain shrink-0" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[7.5px] text-white/40 font-semibold uppercase">{t('editor.stars', 'Stars')}</span>
                  <span className="text-[10.5px] font-black text-white">{stars.toLocaleString()}</span>
                </div>
              </button>

              <div className="w-px h-3.5 bg-white/10 shrink-0" />

              {/* 3. Energy Balance */}
              <button
                type="button"
                onClick={() => {
                  try { WebApp?.HapticFeedback?.selectionChanged?.() } catch {}
                  navigate('/shop', { state: { tab: 'energy' } })
                }}
                className="flex items-center gap-1 px-1 py-0.5 rounded-[6px] hover:bg-white/5 active:scale-95 transition-all cursor-pointer shrink-0"
                title={t('editor.energy', 'Energy')}
              >
                <Zap size={12} className="text-[#2AABEE] fill-[#2AABEE]/30 shrink-0" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[7.5px] text-white/40 font-semibold uppercase">{t('editor.energy', 'Energy')}</span>
                  <span className="text-[10.5px] font-black text-white">{energy.toLocaleString()}</span>
                </div>
              </button>

              <div className="w-px h-3.5 bg-white/10 shrink-0" />

              {/* 4. Watermark Free Balance */}
              <button
                type="button"
                onClick={() => {
                  try { WebApp?.HapticFeedback?.selectionChanged?.() } catch {}
                  navigate('/shop', { state: { tab: 'pro' } })
                }}
                className="flex items-center gap-1 px-1 py-0.5 rounded-[6px] hover:bg-white/5 active:scale-95 transition-all cursor-pointer shrink-0"
                title={t('editor.watermark_free', 'No Watermark')}
              >
                <Droplets size={12} className="text-emerald-400 shrink-0" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[7.5px] text-white/40 font-semibold uppercase">{t('editor.watermark_free', 'No WM')}</span>
                  <span className="text-[10.5px] font-black text-emerald-400">
                    {noWatermarkUnlimited ? '∞' : (proPlan ? `${noWatermarkLeft}` : (watermarkFreeSavesBonus > 0 ? `${watermarkFreeSavesBonus}` : '5⚡'))}
                  </span>
                </div>
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                try { WebApp?.HapticFeedback?.selectionChanged?.() } catch {}
                setIsExpanded(false)
              }}
              className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white shrink-0 cursor-pointer transition-colors ml-0.5"
              title={t('editor.cancel', 'Close')}
            >
              <X size={11} strokeWidth={2.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

