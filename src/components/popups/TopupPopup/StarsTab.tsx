import { useState } from 'react'
import starsIcon from '@assets/icons/Stars.webp'
import { useTranslation } from 'react-i18next'

export const StarsTab = () => {
  const { t } = useTranslation()
  const [amount, setAmount] = useState('0')
  const presets = [25, 50, 100, 250, 500, 1000, 2500, 5000]
  const displayAmount = amount || '0'
  const amountFontSize = displayAmount.length > 12 ? 24 : displayAmount.length > 9 ? 30 : displayAmount.length > 6 ? 38 : displayAmount.length > 3 ? 46 : 56

  const updateAmount = (value: string) => {
    const nextAmount = value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')
    setAmount(nextAmount)
  }

  const handleTopUp = () => {
    const num = parseInt(amount)
    if (!num || num <= 0) return
    // TODO: wire up Telegram Stars payment
    alert(`Topping up ${num} Stars…`)
  }

  return (
    <div className="flex flex-col items-center px-4 pb-8 w-full">
      {/* Stars Pill */}
      <div className="bg-[#191b1b] rounded-[18px] px-9 py-5 flex items-center gap-3 mb-8 shadow-[0_0_24px_rgba(34,158,217,0.18)] border border-[#229ED9]/20">
        <img src={starsIcon} alt="Stars" className="w-6 h-6 drop-shadow-[0_0_9px_rgba(255,170,30,0.55)]" />
        <span className="text-white font-extrabold">{t('popups.stars')}</span>
      </div>

      {/* Input Area */}
      <div className="flex flex-col items-center mb-8 w-full">
        <span className="text-[#168AC0] text-[15px] font-semibold mb-3">{t('popups.enter_amount')}</span>
        <div className="flex items-center justify-center min-h-[86px] w-full overflow-hidden">
          <input 
            type="text" 
            inputMode="numeric"
            value={amount}
            onChange={(e) => updateAmount(e.target.value)}
            className="text-white font-extrabold leading-none bg-transparent min-w-[1ch] text-center outline-none placeholder:text-white"
            style={{
              width: `${Math.max(displayAmount.length, 1)}ch`,
              maxWidth: 'calc(100vw - 48px)',
              fontSize: `${amountFontSize}px`,
            }}
            placeholder="0"
          />
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-4 gap-2.5 w-full mb-5">
        {presets.map((preset) => (
          <button 
            key={preset}
            onClick={() => setAmount(preset.toString())}
            className="bg-[#111] hover:bg-[#181818] transition-colors rounded-[18px] py-3.5 flex items-center justify-center gap-2 border border-white/7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <span className="text-white font-extrabold text-[16px]">{preset}</span>
            <img src={starsIcon} alt="Stars" className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* Top Up Button */}
      <button
        onClick={handleTopUp}
        disabled={!parseInt(amount)}
        className="w-full py-4 rounded-[18px] font-extrabold text-[16px] transition-all
          bg-[#229ED9] text-white shadow-[0_6px_24px_rgba(34,158,217,0.45)]
          hover:bg-[#2AABEE] active:scale-[0.98]
          disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none"
      >
        <span className="flex items-center justify-center gap-1.5">{t('popups.top_up')} <img src={starsIcon} alt="Stars" className="w-4 h-4" /> {parseInt(amount) > 0 ? parseInt(amount).toLocaleString() : ''} {t('popups.stars')}</span>
      </button>
    </div>
  )
}
