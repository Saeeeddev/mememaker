import { useNavigate } from 'react-router-dom'
import { Gift, Zap, Sparkles, Play } from 'lucide-react'
import logoMemeZone from '@assets/Logo/LogoMemeZone.webp'
import { GridScan } from '@components/home/GridScan'
import { useState, useEffect } from 'react'

export function Home() {
  const navigate = useNavigate()
  const [currentBanner, setCurrentBanner] = useState(0)
  
  const banners = [
    { title: "Create Viral Memes", desc: "Start designing now!", icon: <Play className="text-blue-400 w-6 h-6" />, bg: "bg-blue-500/20" },
    { title: "Special Offer", desc: "Get 50% off on premium", icon: <Gift className="text-emerald-400 w-6 h-6" />, bg: "bg-emerald-500/20" },
    { title: "Daily Challenges", desc: "Participate and win stars", icon: <Zap className="text-amber-400 w-6 h-6" />, bg: "bg-amber-500/20" }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-6 pt-2 bg-[#000000]">
     
      
 {/* Featured Large Card */}
      <div>
        <div className="bg-transparent text-center relative overflow-hidden">

          {/* GridScan background — zero padding, sticks to all sides */}
          <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
            <GridScan
              sensitivity={0.55}
              lineThickness={1.1}
              linesColor="#4f2797"
              gridScale={0.09}
              scanColor="#2654d1"
              scanOpacity={0.4}
              enablePost={false}
              bloomIntensity={0.6}
              chromaticAberration={0.001}
              noiseIntensity={0.01}
              lineJitter={0}
              scanGlow={0.6}
              scanSoftness={2}
              enableWebcam={false}
              showPreview={false}
            />
          </div>

          {/* Inner content — own padding, independent of GridScan */}
          <div className="relative px-6 pb-6">
            <img src={logoMemeZone} alt="Meme Zone" className="w-60 h-60 mx-auto mt-42 mb-6 object-contain drop-shadow-2xl" />
            <p className="text-white/50 text-sm mb-6 max-w-[200px] mx-auto">Create viral memes every day!</p>
            <button
              onClick={() => navigate('/editor')}
              className="w-full py-4 rounded-2xl bg-[#229ED9] font-bold text-lg shadow-[0_0_20px_rgba(34,158,217,0.3)] hover:bg-[#2AABEE] transition-all flex items-center justify-center gap-2"
            >
              <Play className="fill-current w-5 h-5" />
              CREATE MEME
            </button>
          </div>

        </div>
      </div>
      {/* Moving Banner */}
      <div className="px-2">
        <div 
          onClick={() => navigate('/editor')}
          className="w-full bg-[#141416] border border-white/10 rounded-3xl p-4 relative overflow-hidden h-32 flex flex-col justify-between cursor-pointer transition-opacity duration-500"
        >
          {banners[currentBanner].icon}
          <div>
            <h3 className="font-bold text-sm text-white">{banners[currentBanner].title}</h3>
            <p className="text-[10px] text-white/60 mt-0.5">{banners[currentBanner].desc}</p>
          </div>
          <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-xl ${banners[currentBanner].bg}`} />
        </div>
      </div>

     

      <div>
        <div className="flex justify-between items-center mb-3 px-2">
          <h2 className="text-lg font-bold">Trending</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pt-3 pb-4 px-2 custom-scrollbar">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative shrink-0">
              <div className="w-20 h-20 bg-[#2C2C2E] rounded-2xl border border-white/10 flex items-center justify-center">
                <Sparkles className="text-white/40 w-8 h-8" />
              </div>
              <div className="absolute -top-2 -right-2 bg-[#229ED9] text-[11px] font-bold min-w-[1.5rem] h-[1.5rem] flex items-center justify-center px-1.5 rounded-full border-2 border-[#000000] leading-none whitespace-nowrap">
                {i * 10}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
