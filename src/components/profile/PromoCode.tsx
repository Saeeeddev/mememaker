import { useState } from 'react'
import { ChevronRight, ChevronDown, Ticket } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface PromoCodeProps {
  onExpand?: (expanded: boolean) => void
}

export const PromoCode = ({ onExpand }: PromoCodeProps = {}) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const [code, setCode] = useState('')

  const handleToggle = () => {
    const next = !expanded
    setExpanded(next)
    onExpand?.(next)
  }

  return (
    <div className="mt-4 bg-[#141416] rounded-[18px] p-4">
      {/* Header (always visible) */}
      <div 
        className={`flex items-center justify-between cursor-pointer transition-colors ${expanded ? 'mb-3.5' : ''}`}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2.5">
          <Ticket size={20} className="text-[#f5a623]" />
          <span className="text-[15.5px] font-bold text-white">{t('profile.promo_code')}</span>
        </div>
        <div className="flex items-center gap-2.5">
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
              <p className="text-[#8a8f98] text-[14px] leading-relaxed">
                {t('profile.enter_promo_desc')}
              </p>

              <div className="flex p-1 gap-3">
                <input 
                  type="text" 
                  placeholder={t('profile.enter_code')}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 bg-[#1c1c1e] text-white placeholder-white/40 text-[14px] font-medium rounded-[14px] px-4 py-2.5 outline-none focus:ring-1 focus:ring-[#229ED9]/50 transition-shadow"
                />
                <button 
                  disabled={!code.trim()}
                  className="bg-[#229ED9] text-white font-semibold text-[14px] rounded-[14px] px-5 py-2.5 hover:bg-[#229ED9]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('profile.apply')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
