import { useState } from 'react'

export const StarsTab = () => {
  const [amount, setAmount] = useState('0')
  const presets = [25, 50, 100, 250, 500, 1000, 2500, 5000]
  const displayAmount = amount || '0'
  const amountFontSize = displayAmount.length > 12 ? 24 : displayAmount.length > 9 ? 30 : displayAmount.length > 6 ? 38 : displayAmount.length > 3 ? 46 : 56

  const updateAmount = (value: string) => {
    const nextAmount = value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')
    setAmount(nextAmount)
  }

  return (
    <div className="flex flex-col items-center px-4 pb-8 w-full">
      {/* Stars Pill */}
      <div className="bg-[#191b1b] rounded-[18px] px-9 py-5 flex items-center gap-3 mb-8 shadow-[0_0_24px_rgba(34,158,217,0.18)] border border-[#229ED9]/20">
        <span className="text-[#c9902b] drop-shadow-[0_0_9px_rgba(255,170,30,0.55)]">⭐</span>
        <span className="text-white font-extrabold">Stars</span>
      </div>

      {/* Input Area */}
      <div className="flex flex-col items-center mb-8 w-full">
        <span className="text-[#168AC0] text-[15px] font-semibold mb-3">Enter amount</span>
        <div className="flex items-center justify-center min-h-[86px] w-full overflow-hidden">
          <input 
            type="text" 
            inputMode="numeric"
            value={amount}
            onChange={(e) => updateAmount(e.target.value)}
            className="text-white font-extrabold leading-none bg-transparent min-w-[1ch] text-right outline-none placeholder:text-white"
            style={{
              width: `${Math.max(displayAmount.length, 1)}ch`,
              maxWidth: 'calc(100vw - 152px)',
              fontSize: `${amountFontSize}px`,
            }}
            placeholder="0"
          />
          <div className="w-0.5 h-[76px] bg-[#229ED9]/80 mx-4 shrink-0"></div>
          <span className="text-[52px] leading-none drop-shadow-[0_0_16px_rgba(255,171,28,0.9)]">⭐</span>
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-4 gap-2.5 w-full">
        {presets.map((preset) => (
          <button 
            key={preset}
            onClick={() => setAmount(preset.toString())}
            className="bg-[#111] hover:bg-[#181818] transition-colors rounded-[18px] py-3.5 flex items-center justify-center gap-2 border border-white/7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <span className="text-white font-extrabold text-[16px]">{preset}</span>
            <span className="text-[#9b742b] text-[13px]">⭐</span>
          </button>
        ))}
      </div>
    </div>
  )
}
