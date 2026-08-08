import { useAppStore } from '@store/useAppStore'
import { ProfileHeader } from '@components/profile/ProfileHeader'
import { MyMemes } from '@components/profile/MyMemes'
import { InviteFriends } from '@components/profile/InviteFriends'
import GradientWaves from '@components/profile/GradientWaves'
import gramDiamondMark from '@assets/icons/GramDiamondMark.png'
import LiquidGlass from 'liquid-glass-react'

const Profile = () => {
  const { openTopup } = useAppStore()

  return (
    <div className="flex flex-col min-h-[calc(100dvh+7rem)] bg-black relative pb-28 -mx-4 -mt-4 -mb-[calc(7rem+env(safe-area-inset-bottom))]">
      {/* Hero balance panel */}
      <div className="relative overflow-hidden pt-7 pb-9 text-center bg-[#202B36]">
        <div className="absolute inset-0">
          <GradientWaves
            horizonColor="#229ED9"
            waveColor="#2AABEE"
            crestColor="#202B36"
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
            0.00
            <img src={gramDiamondMark} alt="" className="h-[27px] w-[27px] object-contain" />
          </div>
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-lg font-semibold text-[#F5A623]">
            0
            <svg width="19" height="19" viewBox="0 0 24 24" fill="#F5A623">
              <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.6 5.9 21l1.5-6.8-5.2-4.7 6.9-.7L12 2.5z" />
            </svg>
          </div>

          {/* Action pills */}
          <div className="mt-6 flex justify-center gap-3 px-4">
            {[
              {
                label: 'Top up TON',
                tab: 'ton' as const,
                icon: (
                  <img src={gramDiamondMark} alt="" className="h-[19px] w-[19px] object-contain" />
                ),
              },
              {
                label: 'Top up Stars',
                tab: 'stars' as const,
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#F5A623">
                    <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.6 5.9 21l1.5-6.8-5.2-4.7 6.9-.7L12 2.5z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => item.tab && openTopup(item.tab)}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <div className="relative w-full h-12 rounded-full overflow-hidden shadow-[0_10px_22px_rgba(0,0,0,0.24)]">
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
                    <div className="h-12 w-[calc((100vw-44px)/2)] max-w-[202px] rounded-full bg-white/12 border border-white/8 hover:bg-white/20 transition-colors" />
                  </LiquidGlass>
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    {item.icon}
                  </div>
                </div>
                <span className="text-[12.5px] text-[#dfe6e8]">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content sheet */}
      <div className="bg-black -mt-3.5 rounded-t-[22px] relative z-2 px-4 pt-[18px] pb-24">
        {/* Profile row */}
        <ProfileHeader />

        {/* Meme history */}
        <MyMemes />

        {/* Invite Friends */}
        <InviteFriends />
      </div>
    </div>
  )
}

export default Profile
