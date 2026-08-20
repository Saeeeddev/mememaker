import { Crown, Droplets, Image as ImageIcon, Sparkles, Disc3, Zap } from 'lucide-react'
import starsIcon from '@assets/icons/Stars.webp'
import type { ProPlan } from '@/types/shop'
import { useTranslation } from 'react-i18next'

interface ProPlanCardProps {
  plan: ProPlan
  onSubscribe?: (plan: ProPlan) => void
}

export function ProPlanCard({ plan, onSubscribe }: ProPlanCardProps) {
  const { t } = useTranslation()
  const isPopular = Boolean(plan.popular)

  return (
    <div className="bg-[#141416] rounded-[18px] p-4 flex flex-col gap-3.5 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-[46px] h-[46px] rounded-[14px] bg-[#1c1c1e] border border-[#35363a] flex items-center justify-center shrink-0">
            <Crown size={22} className={isPopular ? 'text-[#f5a623]' : 'text-[#56b6ff]'} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[15.5px] font-bold text-white leading-tight truncate">
                {plan.label}
              </h3>
              {isPopular && (
                <span className="bg-[#f5a623]/20 border border-[#f5a623]/40 text-[#f5a623] px-2 py-0.5 rounded-full font-bold text-[10.5px] leading-none shrink-0">
                  ⭐ {t('shop.popular', 'POPULAR')}
                </span>
              )}
            </div>
            <div className="text-[#8a8f98] text-[13px] mt-0.5">
              {plan.period}
            </div>
          </div>
        </div>

        {/* Stars Price Pill */}
        <div className="bg-[#1c1c1e] border border-[#35363a] px-3 py-1.5 rounded-[12px] flex items-center gap-1.5 shrink-0">
          <span className="text-[14px] font-black text-white">{plan.stars.toLocaleString()}</span>
          <img src={starsIcon} alt="Stars" className="w-4 h-4 object-contain" />
        </div>
      </div>

      {/* Quota Overview Box (Profile style) */}
      <div className="bg-[#1c1c1e] rounded-[14px] p-3.5 border border-[#35363a] grid grid-cols-2 gap-2.5">
        {/* 1. Watermark-Free Creations */}
        <div className="bg-white/5 rounded-[12px] p-2.5 flex flex-col justify-between">
          <div className="text-[#8a8f98] text-[11px] font-semibold flex items-center gap-1.5 mb-1">
            <Droplets size={13} className="text-[#31B57A]" />
            <span className="truncate">{t('shop.no_watermark', 'No Watermark')}</span>
          </div>
          <div className="text-white font-extrabold text-[13px]">
            {plan.noWatermarkLimit === 'unlimited'
              ? `∞ ${t('shop.unlimited', 'Unlimited')}`
              : `${plan.noWatermarkLimit ?? 50} ${t('shop.saves', 'Saves')}`}
          </div>
        </div>

        {/* 2. Standard Creations */}
        <div className="bg-white/5 rounded-[12px] p-2.5 flex flex-col justify-between">
          <div className="text-[#8a8f98] text-[11px] font-semibold flex items-center gap-1.5 mb-1">
            <ImageIcon size={13} className="text-[#56b6ff]" />
            <span className="truncate">{t('shop.standard_creations', 'Standard Saves')}</span>
          </div>
          <div className="text-white font-extrabold text-[13px]">
            {plan.withWatermarkLimit === 'unlimited'
              ? `∞ ${t('shop.unlimited', 'Unlimited')}`
              : `${plan.withWatermarkLimit ?? 100} ${t('shop.saves', 'Saves')}`}
          </div>
        </div>

        {/* 3. AI Generations */}
        <div className="bg-white/5 rounded-[12px] p-2.5 flex flex-col justify-between">
          <div className="text-[#8a8f98] text-[11px] font-semibold flex items-center gap-1.5 mb-1">
            <Sparkles size={13} className="text-[#A358DF]" />
            <span className="truncate">{t('shop.ai_prompts', 'AI Text Prompts')}</span>
          </div>
          <div className="text-white font-extrabold text-[13px]">
            {plan.aiGenerationsLimit === 'unlimited'
              ? `∞ ${t('shop.unlimited', 'Unlimited')}`
              : `${plan.aiGenerationsLimit ?? 5} ${t('shop.ai_gens', 'AI Gens')}`}
          </div>
        </div>

        {/* 4. Daily Spinner */}
        <div className="bg-white/5 rounded-[12px] p-2.5 flex flex-col justify-between">
          <div className="text-[#8a8f98] text-[11px] font-semibold flex items-center gap-1.5 mb-1">
            <Disc3 size={13} className="text-[#2AABEE]" />
            <span className="truncate">{t('shop.daily_spins', 'Daily Wheel')}</span>
          </div>
          <div className="text-white font-extrabold text-[13px]">
            +{plan.dailySpinsBonus ?? 3} {t('shop.free_spins', 'Spins')}
          </div>
        </div>
      </div>

      {/* Bonus Energy Badge */}
      {plan.bonusEnergy && plan.bonusEnergy > 0 ? (
        <div className="flex">
          <span className="bg-[#1f3a52] px-2.5 py-1 rounded-full text-[#56b6ff] font-bold text-[12px] flex items-center gap-1.5">
            <Zap size={13} className="fill-[#56b6ff]/30" /> +{plan.bonusEnergy}⚡ {t('shop.bonus_energy', 'Bonus Energy Included')}
          </span>
        </div>
      ) : null}

      {/* Action Button (Solid White with Black Text matching Profile) */}
      <button
        type="button"
        onClick={() => onSubscribe?.(plan)}
        className="w-full bg-white text-black font-extrabold text-[14.5px] rounded-[14px] py-3 hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
      >
        <span>{t('shop.get_plan', 'Get Pro')}</span>
        <span className="opacity-30">•</span>
        <span className="flex items-center gap-1">
          {plan.stars.toLocaleString()}
          <img src={starsIcon} alt="Stars" className="w-4 h-4 object-contain" />
        </span>
      </button>
    </div>
  )
}
