import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Zap, Ticket, Star } from 'lucide-react'
import spinnerBg from '@assets/images/SpinnerBackgroundPage.webp'
import spinnerCenterBut from '@assets/images/SpinnerCenterBut.webp'

const PRIZES = [
  { id: 1, label: '500\nSTARS', color: 'from-[#e49b1a] to-[#f8cd46]', icon: Star, iconColor: 'fill-[#fdf2a6] text-[#e09b10]' }, 
  { id: 2, label: 'DAILY\nPREMIUM', color: 'from-[#0d2a71] to-[#1a51cf]', icon: Gift, iconColor: 'fill-[#519ee7] text-[#8cd6ff]' },
  { id: 3, label: 'SPIN\nAGAIN', color: 'from-[#1b1c20] to-[#363840]', icon: Ticket, iconColor: 'fill-[#a5a9b4] text-[#cfd3dd]' },
  { id: 4, label: '100\nSTARS', color: 'from-[#e49b1a] to-[#f8cd46]', icon: Star, iconColor: 'fill-[#fdf2a6] text-[#e09b10]' },
  { id: 5, label: '5\nENERGY', color: 'from-[#0d2a71] to-[#1a51cf]', icon: Zap, iconColor: 'fill-[#519ee7] text-[#8cd6ff]' },
  { id: 6, label: 'MYSTERY\nREWARD', color: 'from-[#1b1c20] to-[#363840]', icon: Gift, iconColor: 'fill-[#519ee7] text-[#8cd6ff]' },
  { id: 7, label: '250\nSTARS', color: 'from-[#e49b1a] to-[#f8cd46]', icon: Star, iconColor: 'fill-[#fdf2a6] text-[#e09b10]' },
  { id: 8, label: '10\nENERGY', color: 'from-[#0d2a71] to-[#1a51cf]', icon: Zap, iconColor: 'fill-[#519ee7] text-[#8cd6ff]' },
]

export function Spinner() {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [wonPrize, setWonPrize] = useState<typeof PRIZES[0] | null>(null)

  const handleSpin = () => {
    if (spinning) return
    setSpinning(true)
    setWonPrize(null)

    const prizeIndex = Math.floor(Math.random() * PRIZES.length)
    const sliceAngle = 360 / PRIZES.length
    
    // We add 5 extra full rotations
    const extraSpins = 5 * 360
    
    // To center the slice on the top pointer, we calculate the angle to its center
    // The start of the slice is prizeIndex * sliceAngle. 
    // The center is prizeIndex * sliceAngle + (sliceAngle / 2).
    const centerOffset = sliceAngle / 2
    const targetAngle = 360 - (prizeIndex * sliceAngle + centerOffset)
    
    const currentRotMod = rotation % 360
    const newRotation = rotation + extraSpins + (targetAngle - currentRotMod + 360) % 360

    setRotation(newRotation)

    setTimeout(() => {
      setSpinning(false)
      setWonPrize(PRIZES[prizeIndex])
    }, 3000)
  }

  return (
    <div 
      className="flex flex-col items-center justify-center pt-16 pb-24 -mx-1 rounded-3xl bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${spinnerBg})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        {/* Free Spins Badge */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#1c1c1e]/80 backdrop-blur-md border border-white/10 rounded-[12px] px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <Gift size={14} className="text-[#229ED9]" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-white/60 leading-tight uppercase tracking-wider">Free Spins</span>
          <span className="text-[12px] font-black text-white leading-tight">2 of 2</span>
        </div>
      </div>
      
      {/* Prize Popup */}
      <AnimatePresence>
        {wonPrize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setWonPrize(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-[#1c1c1e] border border-white/10 rounded-3xl p-8 max-w-[280px] w-full flex flex-col items-center text-center shadow-[0_0_40px_rgba(34,158,217,0.3)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0a1b4d] to-[#1a3b85] flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(34,158,217,0.5)] border-4 border-[#229ED9]">
                <wonPrize.icon className={`w-12 h-12 ${wonPrize.iconColor} drop-shadow-lg`} />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">YOU WON!</h2>
              <p className="text-xl font-bold text-[#f5a623] mb-8 leading-tight">
                {wonPrize.label.replace('\n', ' ')}
              </p>
              <button
                onClick={() => setWonPrize(null)}
                className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-[#229ED9] to-[#2ab6f6] shadow-[0_4px_15px_rgba(34,158,217,0.4)] active:scale-95 transition-transform"
              >
                CLAIM
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Outer Ring and Wheel Container */}
        <div className="relative w-72 h-72 mb-16 mt-4">
          
          {/* Outer Ring */}
          <div className="absolute inset-[-16px] rounded-full bg-[#0a1b4d] shadow-[0_0_20px_rgba(0,0,0,0.8)] border-[3px] border-[#1a3b85]">
            {/* Animated Light bulbs */}
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div 
                key={`bulb-${i}`}
                className="absolute top-0 left-1/2 w-2.5 h-2.5 rounded-full bg-[#8ce0ff] shadow-[0_0_12px_#8ce0ff] origin-[center_160px] -translate-x-1/2"
                style={{ transform: `translateY(-1px) rotate(${i * 22.5}deg)` }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.05 }}
              />
            ))}
          </div>

          {/* Pointer */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
            <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
              <path d="M4 0L36 0C38.2 0 40 1.8 40 4L22.8 45.2C21.3 48.8 18.7 48.8 17.2 45.2L0 4C0 1.8 1.8 0 4 0Z" fill="#1a51cf" />
              <path d="M4 0L36 0C38.2 0 40 1.8 40 4L22.8 45.2C21.3 48.8 18.7 48.8 17.2 45.2L0 4C0 1.8 1.8 0 4 0Z" stroke="#0d2a71" strokeWidth="2" />
              <circle cx="20" cy="12" r="4" fill="#8ce0ff" />
            </svg>
          </div>

          {/* Wheel */}
          <motion.div
            className="w-full h-full rounded-full border-[3px] border-[#122143] overflow-hidden relative shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-[#1c1c1e]"
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {PRIZES.map((prize, i) => {
              const angle = i * 45
              return (
                <div
                  key={`slice-${prize.id}`}
                  className="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    clipPath: 'polygon(0 100%, 0 0, 100% 0)',
                  }}
                >
                  <div className={`w-full h-full bg-gradient-to-tr ${prize.color} border-l-[2px] border-[#0c142e]`} />
                </div>
              )
            })}
            
            {/* Content overlay */}
            <div className="absolute inset-0">
              {PRIZES.map((prize, i) => {
                const angle = i * 45 + 22.5
                const Icon = prize.icon
                return (
                  <div
                    key={`content-${prize.id}`}
                    className="absolute top-1/2 left-1/2 w-16 h-[126px] origin-bottom -translate-x-1/2 -translate-y-full flex flex-col items-center justify-start pt-[14px]"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <Icon className={`w-7 h-7 mb-1 drop-shadow-md ${prize.iconColor}`} />
                    <span 
                      className="text-white font-black text-[12px] leading-[1.1] text-center" 
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,1)' }}
                    >
                      {prize.label.split('\n').map((line, j) => (
                        <div key={j}>{line}</div>
                      ))}
                    </span>
                  </div>
                )
              })}
            </div>
            
          </motion.div>

          {/* Center hub - Spin Button */}
          <motion.button
            onClick={handleSpin}
            disabled={spinning}
            whileTap={{ scale: 0.9 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[86px] h-[86px] rounded-full shadow-[0_0_20px_rgba(0,0,0,0.9)] z-20 flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden border-2 border-transparent transition-transform"
            style={{ backgroundImage: `url(${spinnerCenterBut})` }}
          >
            <div className={`absolute inset-0 bg-white/20 transition-opacity ${spinning ? 'opacity-100' : 'opacity-0'}`} />
          </motion.button>
        </div>

      </div>
    </div>
  )
}
