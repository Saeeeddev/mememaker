import { useState } from 'react'
import { useAppStore } from '@store/useAppStore'
import { ProfileHeader } from '@components/profile/ProfileHeader'
import { MyMemes } from '@components/profile/MyMemes'
import { InviteFriends } from '@components/profile/InviteFriends'
import GradientWaves from '@components/profile/GradientWaves'
import LiquidGlass from 'liquid-glass-react'
import starsIcon from '@assets/icons/Stars.webp'

const Profile = () => {
  const { openTopup } = useAppStore()
  const [isInviteExpanded, setIsInviteExpanded] = useState(false)

  return (
    <div className={`flex flex-col min-h-dvh bg-black relative -mx-4 -mt-4 ${
      isInviteExpanded 
        ? "overflow-y-auto pb-[calc(7rem+env(safe-area-inset-bottom))]" 
        : "overflow-hidden -mb-[calc(7rem+env(safe-area-inset-bottom))]"
    }`}>
      {/* Hero balance panel */}
      <div className="relative overflow-hidden pt-7 pb-9 text-center bg-[#202B36]">
        <div className="absolute inset-0">
          <GradientWaves
            horizonColor="#229ED9"
            waveColor="#2AABEE"
            crestColor="#cfdce9"
            speed={1.25}
            amplitude={1.9}
            waveScale={1.05}
            waveRatio={0.6}
            swell={35}
            turbulence={20}
            tilt={1.11}
            zoom={1.2}
            height={5.5}
            fogDepth={15}
            detail="high"
            brightness={0.9}
            opacity={1.0}
            mouseInteraction={false}
            parallaxStrength={0.59}
            grain={false}
            grainIntensity={0.05}
          />
        </div>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="text-[#a9c2c8] text-sm mb-1.5">Meme Zone Balance</div>
          <div className="flex items-center justify-center gap-2 text-[42px] font-bold leading-none text-white">
            0
            <img src={starsIcon} alt="Stars" className="w-8 h-8 mb-0.5" />
          </div>

          {/* Action pills */}
          <div className="mt-6 flex justify-center gap-3 px-4">
            <button
              onClick={() => openTopup('stars')}
              className="flex flex-col items-center gap-2"
            >
              <div className="relative w-32 h-12 rounded-full overflow-hidden shadow-[0_10px_22px_rgba(0,0,0,0.24)]">
                <LiquidGlass
                  cornerRadius={24}
                  displacementScale={42}
                  blurAmount={0.12}
                  saturation={135}
                  aberrationIntensity={1.2}
                  padding="0"
                  className="w-full h-full"
                  style={{ position: 'absolute', top: '50%', left: '50%', border: 0, outline: 0 }}
                >
                  <div className="h-12 w-32 rounded-full bg-white/12 border border-white/8 hover:bg-white/20 transition-colors" />
                </LiquidGlass>
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  <img src={starsIcon} alt="Stars" className="w-5 h-5 drop-shadow-md" />
                </div>
              </div>
              <span className="text-[12.5px] text-[#dfe6e8]">Top up Stars</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content sheet */}
      <div className="bg-black -mt-3.5 rounded-t-[22px] relative z-2 px-4 pt-[18px]">
        {/* Profile row */}
        <ProfileHeader />

        {/* Meme history */}
        <MyMemes />

        {/* Invite Friends */}
        <InviteFriends onExpand={setIsInviteExpanded} />
      </div>
    </div>
  )
}

export default Profile
