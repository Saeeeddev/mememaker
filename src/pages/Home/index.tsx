import { useNavigate } from 'react-router-dom'
import { Gift, Zap, Sparkles, Play } from 'lucide-react'

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="pb-10 space-y-6 pt-2">
      {/* Top horizontal trending scroll */}
      <div>
        <div className="flex justify-between items-center mb-3 px-2">
          <h2 className="text-lg font-bold">Trending</h2>
          <button className="text-sm text-blue-400">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 px-2 custom-scrollbar">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="relative shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl border border-white/10 flex items-center justify-center">
                <Sparkles className="text-white/40 w-8 h-8" />
              </div>
              <div className="absolute -top-2 -right-2 bg-blue-500 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#0d0d1a]">
                {i * 10}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two banners side-by-side */}
      <div className="flex gap-3 px-2">
        <div className="flex-1 bg-gradient-to-br from-emerald-600/20 to-teal-900/40 border border-emerald-500/20 rounded-3xl p-4 relative overflow-hidden h-32 flex flex-col justify-between">
          <Gift className="text-emerald-400 w-6 h-6" />
          <div>
            <h3 className="font-bold text-sm text-emerald-100">Free Meme</h3>
            <p className="text-[10px] text-emerald-100/60 mt-0.5">Start creating</p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl" />
        </div>
        
        <div className="flex-1 bg-gradient-to-br from-amber-600/20 to-orange-900/40 border border-amber-500/20 rounded-3xl p-4 relative overflow-hidden h-32 flex flex-col justify-between">
          <Zap className="text-amber-400 w-6 h-6" />
          <div>
            <h3 className="font-bold text-sm text-amber-100">Daily Rewards</h3>
            <p className="text-[10px] text-amber-100/60 mt-0.5">Claim now</p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-amber-500/20 rounded-full blur-xl" />
        </div>
      </div>

      {/* Featured Large Card */}
      <div className="px-2">
        <div className="bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] border border-white/10 rounded-[2rem] p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center border-4 border-white/5">
             <img src="https://api.dicebear.com/7.x/bottts/svg?seed=meme" alt="Mascot" className="w-24 h-24 drop-shadow-2xl" />
          </div>
          
          <h2 className="text-2xl font-extrabold mb-2">Memetic Studio</h2>
          <p className="text-white/50 text-sm mb-6 max-w-[200px] mx-auto">Create viral memes and earn rewards every day!</p>
          
          <button 
            onClick={() => navigate('/editor')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-lg shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all flex items-center justify-center gap-2"
          >
            <Play className="fill-current w-5 h-5" />
            CREATE MEME
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
