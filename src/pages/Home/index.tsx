import { useNavigate } from 'react-router-dom'
import { Sparkles, Play } from 'lucide-react'
import logoMemeZone from '@assets/Logo/LogoMemeZone.webp'
import banner1 from '@assets/images/Banners/banner1 (1).webp'
import banner2 from '@assets/images/Banners/baner2.webp'
import { GridScan } from '@components/home/GridScan'
import { useState, useEffect, useRef } from 'react'

export function Home() {
  const navigate = useNavigate()
  const [currentBanner, setCurrentBanner] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const banners = [
    { src: banner1, id: 1 },
    { src: banner2, id: 2 }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => {
        const next = (prev + 1) % banners.length
        if (scrollRef.current) {
          const width = scrollRef.current.clientWidth
          scrollRef.current.scrollTo({ left: width * next, behavior: 'smooth' })
        }
        return next
      })
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-6 bg-[#000000]">
     
      
 {/* Featured Large Card */}
      <div className="-mt-[calc(1rem+env(safe-area-inset-top)+8px)] -mx-4 h-[40dvh] flex flex-col">
        
        {/* Top area with GridScan background */}
        <div className="relative flex-1 flex flex-col overflow-hidden items-center justify-center pt-[calc(1rem+env(safe-area-inset-top)+20px)] pb-2 px-6">
          <div className="absolute inset-0 z-0">
            <GridScan
              sensitivity={0.55}
              lineThickness={1.1}
              linesColor="#4f2797"
              gridScale={0.045}
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
          
          <div className="relative z-10 flex flex-col items-center mt-2">
            <img src={logoMemeZone} alt="Meme Zone" className="w-36 h-36 object-contain drop-shadow-2xl" />
            <p className="text-white/50 text-xs mt-4">Create viral memes every day!</p>
          </div>
        </div>

        {/* Create Meme Button Area (GridScan ends exactly before this!) */}
        <div className="px-6 pb-6 pt-4 shrink-0">
          <div className="max-w-sm mx-auto w-full">
            <button
              onClick={() => navigate('/editor')}
              className="w-full py-3.5 rounded-[14px] bg-[#229ED9] font-bold text-[16px] shadow-[0_0_20px_rgba(34,158,217,0.3)] hover:bg-[#2AABEE] transition-all flex items-center justify-center gap-2"
            >
              <Play className="fill-current w-4 h-4" />
              CREATE MEME
            </button>
          </div>
        </div>


        </div>
      {/* Swipeable Image Banners */}
      <div className="relative w-full flex flex-col items-center">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          onScroll={(e) => {
            const scrollLeft = e.currentTarget.scrollLeft
            const width = e.currentTarget.clientWidth
            const index = Math.round(scrollLeft / width)
            if (index !== currentBanner) {
              setCurrentBanner(index)
            }
          }}
        >
          {banners.map((b, i) => (
            <div key={b.id} className="min-w-full snap-center px-4">
              <img 
                src={b.src} 
                alt={`Banner ${i + 1}`} 
                className="w-full h-auto rounded-[20px] shadow-lg cursor-pointer" 
                onClick={() => navigate('/editor')}
              />
            </div>
          ))}
        </div>
        
        {/* Dots indicator */}
        <div className="flex gap-1.5 mt-3">
          {banners.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentBanner === i ? 'w-6 bg-[#229ED9]' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
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
