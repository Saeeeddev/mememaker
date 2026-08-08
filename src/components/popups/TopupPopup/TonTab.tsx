import { useState } from 'react'
import gramDiamondMark from '@assets/icons/GramDiamondMark.png'

export const TonTab = () => {
  const [amount, setAmount] = useState('0')
  const [method, setMethod] = useState<'ton' | 'crypto'>('ton')
  const presets = [1, 5, 10, 25]
  const displayAmount = amount || '0'
  const amountFontSize = displayAmount.length > 12 ? 24 : displayAmount.length > 9 ? 30 : displayAmount.length > 6 ? 38 : displayAmount.length > 3 ? 46 : 56
  const tonLabelFontSize = displayAmount.length > 9 ? 38 : displayAmount.length > 6 ? 46 : 56

  const updateAmount = (value: string) => {
    const cleaned = value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*)\./g, '$1')
      .replace(/^0+(?=\d)/, '')

    setAmount(cleaned)
  }

  return (
    <div className="flex flex-col items-center px-4 pb-8 w-full">
      {/* Method Pills */}
      <div className="flex items-center justify-center gap-3 mb-8 w-full max-w-[300px]">
        <button 
          onClick={() => setMethod('ton')}
          className={`flex-1 rounded-[18px] py-5 flex items-center justify-center gap-3 transition-colors border ${
            method === 'ton'
              ? 'bg-[#191b1b] border-[#229ED9]/20 shadow-[0_0_24px_rgba(34,158,217,0.18)]'
              : 'bg-[#111] border-white/6 text-white/45'
          }`}
        >
          <img src={gramDiamondMark} alt="" className="h-6 w-6 object-contain" />
          <span className="text-white font-extrabold">TON</span>
        </button>
        <button 
          onClick={() => setMethod('crypto')}
          className={`flex-1 rounded-[18px] py-5 flex items-center justify-center gap-3 transition-colors border ${
            method === 'crypto'
              ? 'bg-[#191b1b] border-[#229ED9]/20 shadow-[0_0_24px_rgba(34,158,217,0.18)]'
              : 'bg-[#111] border-white/6 text-white/45'
          }`}
        >
          <span className="text-[#81919b] text-lg leading-none">▾</span>
          <span className="text-[#a0a4a8] font-extrabold">CryptoBot</span>
        </button>
      </div>

      {/* Input Area */}
      <div className="flex flex-col items-center mb-8 w-full">
        <span className="text-[#168AC0] text-[15px] font-semibold mb-3">Enter amount</span>
        <div className="flex items-center justify-center min-h-[86px] w-full overflow-hidden">
          <input 
            type="text" 
            inputMode="decimal"
            value={amount}
            onChange={(e) => updateAmount(e.target.value)}
            className="text-white font-extrabold leading-none bg-transparent min-w-[1ch] text-right outline-none placeholder:text-white"
            style={{
              width: `${Math.max(displayAmount.length, 1)}ch`,
              maxWidth: 'calc(100vw - 202px)',
              fontSize: `${amountFontSize}px`,
            }}
            placeholder="0"
          />
          <div className="w-0.5 h-[76px] bg-[#229ED9]/80 mx-4 shrink-0"></div>
          <span
            className="text-white font-extrabold leading-none shrink-0"
            style={{ fontSize: `${tonLabelFontSize}px` }}
          >
            TON
          </span>
        </div>
      </div>

      {/* Wallet Warning */}
      <div className="w-full bg-[#2b0505] border border-[#5b130f] rounded-[18px] px-4 py-4 flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span>👛</span>
          <span className="text-[#ff4545] font-semibold text-[15px]">Wallet not connected</span>
        </div>
        <button className="text-[#ff5858] font-medium text-sm hover:underline">
          Connect Wallet ›
        </button>
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
            <img src={gramDiamondMark} alt="" className="h-3.5 w-3.5 object-contain grayscale opacity-80" />
          </button>
        ))}
      </div>
    </div>
  )
}
