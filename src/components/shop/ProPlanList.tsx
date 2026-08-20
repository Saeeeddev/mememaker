import type { ProPlan } from '@/types/shop'
import { ProPlanCard } from './ProPlanCard'
import { useTranslation } from 'react-i18next'

interface ProPlanListProps {
  plans: ProPlan[]
  onSubscribe?: (plan: ProPlan) => void
}

export function ProPlanList({ plans, onSubscribe }: ProPlanListProps) {
  const { t } = useTranslation()

  if (plans.length === 0) {
    return (
      <div className="text-center py-8 text-white/40">
        {t('shop.no_plans', 'No pro plans available')}
      </div>
    )
  }

  return (
    <div className="space-y-3.5">
      {plans.map((plan) => (
        <ProPlanCard key={plan.id} plan={plan} onSubscribe={onSubscribe} />
      ))}
    </div>
  )
}
