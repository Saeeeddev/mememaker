import { useState } from 'react'
import { Crown, ChevronRight, ChevronDown, Droplets, Sparkles, Disc3, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@store/useAppStore'
import { useNavigate } from 'react-router-dom'
import { WebApp } from '@utils/telegram'

interface ProPlanStatusCardProps {
  onExpand?: (expanded: boolean) => void
}

export const ProPlanStatusCard = ({ onExpand }: ProPlanStatusCardProps = {}) => {
  const { t } = useTranslation()
  const { proPlan } = useAppStore()
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  const handleToggle = () => {
    const next = !expanded
    setExpanded(next)
    onExpand?.(next)
  }

  const handleNavigateToShop = (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      WebApp?.HapticFeedback?.selectionChanged?.()
    } catch {}
    navigate('/shop', { state: { tab: 'pro' } })
  }

  const isPro = Boolean(proPlan)

  const noWatermarkUnlimited = proPlan?.noWatermarkLimit === 'unlimited'
  const noWatermarkLeft = noWatermarkUnlimited
    ? '∞'
    : Math.max(0, ((proPlan?.noWatermarkLimit as number) || 0) - (proPlan?.noWatermarkUsed || 0))
  const noWatermarkPercent = noWatermarkUnlimited
    ? 100
    : Math.min(100, Math.round(((proPlan?.noWatermarkUsed || 0) / ((proPlan?.noWatermarkLimit as number) || 1)) * 100))

  const aiUnlimited = proPlan?.aiGenerationsLimit === 'unlimited'
  const aiLeft = aiUnlimited
    ? '∞'
    : Math.max(0, ((proPlan?.aiGenerationsLimit as number) || 0) - (proPlan?.aiGenerationsUsed || 0))
  const aiPercent = aiUnlimited
    ? 100
    : Math.min(100, Math.round(((proPlan?.aiGenerationsUsed || 0) / ((proPlan?.aiGenerationsLimit as number) || 1)) * 100))

  return (
    <div className="mt-4 bg-[#141416] rounded-[18px] p-4">
      {/* Header (always visible) */}
      <div
        className={`flex items-center justify-between cursor-pointer transition-colors ${
          expanded ? 'mb-3.5' : ''
        }`}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Crown
            size={20}
            className={isPro ? 'text-[#f5a623] shrink-0' : 'text-[#8a8f98] shrink-0'}
          />
          <span className="text-[15.5px] font-bold text-white truncate">
            {isPro ? proPlan?.name : t('profile.pro_membership', 'Pro Membership')}
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {isPro ? (
            <div className="bg-[#f5a623]/20 border border-[#f5a623]/40 px-2.5 py-0.5 rounded-full text-[#f5a623] font-bold text-[12px]">
              {proPlan?.expiresAt || 'Active'}
            </div>
          ) : (
            <div className="bg-white/10 px-2.5 py-0.5 rounded-full text-white/60 font-bold text-[12px]">
              Free
            </div>
          )}

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
                {isPro
                  ? `Your ${proPlan?.name} is active with exclusive quota limits and daily perks.`
                  : 'Upgrade to a Pro plan for watermark-free saves, AI meme generation, daily wheel boosts, and instant energy.'}
              </p>

              {/* Action Button */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleNavigateToShop}
                  className="flex-1 bg-white text-black font-extrabold text-[14px] rounded-[14px] py-2.5 hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Crown size={16} className="text-[#f5a623]" />
                  <span>{isPro ? t('profile.manage_pro', 'Manage Pro Subscription') : t('profile.upgrade_pro', 'Upgrade to Pro')}</span>
                </button>
              </div>

              {/* Stats & Usage Box (same aesthetic as InviteFriends / PromoCode) */}
              <div className="bg-[#1c1c1e] rounded-[14px] p-4 flex flex-col gap-3.5 border border-[#35363a]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-lg leading-tight">
                        {isPro ? proPlan?.name : 'Free Tier'}
                      </span>
                      {isPro && (
                        <span className="text-[10px] font-black uppercase text-[#f5a623] bg-[#f5a623]/20 px-2 py-0.5 rounded-full">
                          PRO
                        </span>
                      )}
                    </div>
                    <span className="text-[#8a8f98] text-[12.5px]">
                      {isPro ? `Subscription valid: ${proPlan?.expiresAt || proPlan?.period}` : 'Standard daily limits active'}
                    </span>
                  </div>
                </div>

                {isPro ? (
                  /* Pro Quota Meters */
                  <div className="flex flex-col gap-3 pt-1">
                    {/* No Watermark Meter */}
                    <div className="bg-white/5 rounded-[12px] p-3">
                      <div className="flex items-center justify-between text-[12px] mb-1.5">
                        <span className="text-white/70 font-semibold flex items-center gap-1.5">
                          <Droplets size={13} className="text-[#31B57A]" /> No-Watermark Saves
                        </span>
                        <span className="font-bold text-[#31B57A]">
                          {noWatermarkUnlimited
                            ? '∞ Unlimited'
                            : `${proPlan?.noWatermarkUsed} / ${proPlan?.noWatermarkLimit} (${noWatermarkLeft} left)`}
                        </span>
                      </div>
                      {!noWatermarkUnlimited && (
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#31B57A] to-[#4eed9f]"
                            style={{ width: `${Math.min(100, noWatermarkPercent)}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* AI Generation Meter */}
                    <div className="bg-white/5 rounded-[12px] p-3">
                      <div className="flex items-center justify-between text-[12px] mb-1.5">
                        <span className="text-white/70 font-semibold flex items-center gap-1.5">
                          <Sparkles size={13} className="text-[#A358DF]" /> AI Text Generations
                        </span>
                        <span className="font-bold text-[#A358DF]">
                          {aiUnlimited
                            ? '∞ Unlimited'
                            : `${proPlan?.aiGenerationsUsed} / ${proPlan?.aiGenerationsLimit} (${aiLeft} left)`}
                        </span>
                      </div>
                      {!aiUnlimited && (
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#A358DF] to-[#d68bff]"
                            style={{ width: `${Math.min(100, aiPercent)}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Additional perks pills */}
                    <div className="grid grid-cols-2 gap-2 mt-0.5">
                      <div className="bg-white/5 rounded-[12px] p-2.5 flex items-center gap-2">
                        <Disc3 size={15} className="text-[#2AABEE]" />
                        <div className="min-w-0">
                          <div className="text-[12px] font-bold text-white truncate">
                            +{proPlan?.dailySpinsBonus} Free Spins
                          </div>
                          <div className="text-[10px] text-white/40">Daily Wheel</div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-[12px] p-2.5 flex items-center gap-2">
                        <Zap size={15} className="text-[#f5a623] fill-[#f5a623]/30" />
                        <div className="min-w-0">
                          <div className="text-[12px] font-bold text-white truncate">
                            +{proPlan?.bonusEnergy}⚡ Energy
                          </div>
                          <div className="text-[10px] text-white/40">Bonus Energy</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Free Tier Summary */
                  <div className="grid grid-cols-2 gap-2.5 mt-0.5">
                    <div className="bg-white/5 rounded-[12px] p-3 flex flex-col gap-1">
                      <span className="text-[#8a8f98] text-[11.5px]">AI Generations</span>
                      <span className="text-white font-bold text-sm">2 Free / Day</span>
                      <span className="text-white/40 text-[10px]">5 ⚡ Energy after</span>
                    </div>

                    <div className="bg-white/5 rounded-[12px] p-3 flex flex-col gap-1">
                      <span className="text-[#8a8f98] text-[11.5px]">Watermark Removal</span>
                      <span className="text-[#2AABEE] font-bold text-sm">5 ⚡ Energy</span>
                      <span className="text-white/40 text-[10px]">Free with Pro</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
