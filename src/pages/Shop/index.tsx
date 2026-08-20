import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useShop } from '@hooks/useShop'
import { EnergyPackList } from '@components/shop/EnergyPackList'
import { ProPlanList } from '@components/shop/ProPlanList'
import { ShopSkeleton } from '@components/skeletons/ShopSkeleton'
import { BalanceBadges } from '@components/ui/BalanceBadges'
import type { EnergyPack, ProPlan } from '@/types/shop'
import { WebApp } from '@utils/telegram'
import { CheckCircle2, Zap, Crown, X } from 'lucide-react'
import starsIcon from '@assets/icons/Stars.webp'
import { useAppStore } from '@store/useAppStore'

type ShopTab = 'energy' | 'pro'

export function Shop() {
  const { energyPacks, proPlans, loading } = useShop()
  const { addEnergy, setProPlan } = useAppStore()
  const { t } = useTranslation()
  const location = useLocation()

  const initialTab: ShopTab = location.state?.tab === 'pro' ? 'pro' : 'energy'
  const [activeTab, setActiveTab] = useState<ShopTab>(initialTab)

  // Feedback modal state
  const [purchasedItem, setPurchasedItem] = useState<{
    type: 'energy' | 'pro'
    name: string
    amount?: number
    stars: number
  } | null>(null)

  useEffect(() => {
    const main = document.getElementById('main-scroll-container')
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    if (main) main.style.overflowY = 'auto'

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (main) main.style.overflowY = 'auto'
    }
  }, [activeTab])

  const handleBuyEnergyPack = (pack: EnergyPack) => {
    try {
      WebApp?.HapticFeedback?.notificationOccurred?.('success')
    } catch {}
    addEnergy(pack.energy)
    setPurchasedItem({
      type: 'energy',
      name: pack.name,
      amount: pack.energy,
      stars: pack.stars,
    })
  }

  const handleSubscribeProPlan = (plan: ProPlan) => {
    try {
      WebApp?.HapticFeedback?.notificationOccurred?.('success')
    } catch {}
    if (plan.bonusEnergy && plan.bonusEnergy > 0) {
      addEnergy(plan.bonusEnergy)
    }
    setProPlan({
      id: plan.id,
      name: plan.label,
      period: plan.period,
      expiresAt: `${plan.period} left`,
      color: plan.color,
      noWatermarkLimit: plan.noWatermarkLimit ?? 50,
      noWatermarkUsed: 0,
      withWatermarkLimit: plan.withWatermarkLimit ?? 100,
      withWatermarkUsed: 0,
      aiGenerationsLimit: plan.aiGenerationsLimit ?? 5,
      aiGenerationsUsed: 0,
      dailySpinsBonus: plan.dailySpinsBonus ?? 3,
      bonusEnergy: plan.bonusEnergy ?? 50,
    })
    setPurchasedItem({
      type: 'pro',
      name: plan.label,
      stars: plan.stars,
    })
  }

  if (loading) return <ShopSkeleton />

  return (
    <div className="pt-2 px-1 pb-24">
      {/* Page Header */}
      <div className="mb-4 flex items-center justify-between px-2 shrink-0">
        <h1 className="text-[28px] font-black text-white italic">
          {t('shop.title').toUpperCase()}
        </h1>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-gradient-to-r from-[#229ED9] to-[#2AABEE] px-3 py-1 text-[12px] font-black text-white shadow-[0_2px_8px_rgba(34,158,217,0.4)] flex items-center gap-1">
            <span>
              {activeTab === 'energy'
                ? `${energyPacks.length} ${t('shop.packs_count', 'Packs')}`
                : `${proPlans.length} ${t('shop.plans_count', 'Plans')}`}
            </span>
          </div>
          <BalanceBadges size="sm" />
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="flex gap-1 mb-6 bg-white/5 p-1.5 rounded-[20px] mx-2 overflow-x-auto [&::-webkit-scrollbar]:hidden shrink-0">
        {[
          { id: 'energy', label: t('shop.energy_packs', 'Energy Packs') },
          { id: 'pro', label: t('shop.pro_plans', 'Pro Plans') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ShopTab)}
            className={`relative px-4 py-2.5 text-[14px] font-bold rounded-[14px] whitespace-nowrap transition-colors flex-1 z-10 ${
              activeTab === tab.id ? 'text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="shop-tab-indicator"
                className="absolute inset-0 bg-[#229ED9] rounded-[14px] -z-10 shadow-[0_2px_10px_rgba(34,158,217,0.4)]"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-1">
        {activeTab === 'energy' && (
          <EnergyPackList packs={energyPacks} onBuy={handleBuyEnergyPack} />
        )}

        {activeTab === 'pro' && (
          <ProPlanList plans={proPlans} onSubscribe={handleSubscribeProPlan} />
        )}
      </div>

      {/* Purchase Confirmation / Success Modal */}
      <AnimatePresence>
        {purchasedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPurchasedItem(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-[#18191d] border border-white/10 rounded-[28px] p-6 shadow-2xl z-10 flex flex-col items-center text-center"
            >
              <button
                onClick={() => setPurchasedItem(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-[#00f0b5]/15 border border-[#00f0b5]/30 flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(0,240,181,0.25)]">
                {purchasedItem.type === 'energy' ? (
                  <Zap className="w-8 h-8 text-[#00f0b5] fill-[#00f0b5]/30" />
                ) : (
                  <Crown className="w-8 h-8 text-[#f5a623]" />
                )}
              </div>

              <h3 className="text-xl font-black text-white mb-1">
                {t('shop.purchase_success_title', 'Purchase Successful!')}
              </h3>

              <p className="text-sm text-white/70 mb-4">
                {purchasedItem.type === 'energy'
                  ? t('shop.purchase_success_energy', {
                      amount: purchasedItem.amount?.toLocaleString(),
                      defaultValue: `You received +${purchasedItem.amount}⚡ Energy!`,
                    })
                  : t('shop.purchase_success_pro', {
                      plan: purchasedItem.name,
                      defaultValue: `You are now subscribed to ${purchasedItem.name}!`,
                    })}
              </p>

              <div className="w-full bg-white/5 border border-white/8 rounded-[16px] p-3 mb-5 flex items-center justify-between">
                <span className="text-xs text-white/50 font-medium">
                  {purchasedItem.name}
                </span>
                <div className="flex items-center gap-1.5 font-black text-sm text-white">
                  <span>{purchasedItem.stars}</span>
                  <img src={starsIcon} alt="Stars" className="w-4 h-4 object-contain" />
                </div>
              </div>

              <button
                onClick={() => setPurchasedItem(null)}
                className="w-full py-3.5 rounded-[16px] font-extrabold text-[15px] bg-[#229ED9] text-white shadow-[0_4px_18px_rgba(34,158,217,0.4)] hover:bg-[#2AABEE] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                {t('shop.close', 'Done')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Shop
