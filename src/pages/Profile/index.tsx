import { useTranslation } from 'react-i18next'
import { useAppStore } from '@store/useAppStore'
import { useNavigate } from 'react-router-dom'
import { ProfileHeader } from '@components/profile/ProfileHeader'
import { ProPlanStatusCard } from '@components/profile/ProPlanStatusCard'
import { MyMemes } from '@components/profile/MyMemes'
import { InviteFriends } from '@components/profile/InviteFriends'
import { PromoCode } from '@components/profile/PromoCode'
import GradientWaves from '@components/profile/GradientWaves'
import starsIcon from '@assets/icons/Stars.webp'
import { WebApp } from '@utils/telegram'

const Profile = () => {
  const { energy, stars, openTopup } = useAppStore()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleTopupStars = () => {
    try {
      WebApp?.HapticFeedback?.selectionChanged?.()
    } catch {}
    openTopup('stars')
  }

  const handleGetEnergy = () => {
    try {
      WebApp?.HapticFeedback?.selectionChanged?.()
    } catch {}
    navigate('/shop', { state: { tab: 'energy' } })
  }

  return (
    <div className="flex flex-col min-h-dvh bg-black relative -mx-4 -mt-4 overflow-y-auto pb-[calc(8.5rem+env(safe-area-inset-bottom))]">
      {/* Hero balance panel */}
      <div className="relative overflow-hidden pt-6 pb-7 text-center bg-[#202B36]">
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
        <div className="absolute inset-0 bg-black/15" />
        
        {/* Balances Container */}
        <div className="relative z-10 px-4">
          <div className="text-[#a9c2c8] text-[13px] font-extrabold uppercase tracking-wider mb-3.5">
            {t('profile.balance', 'Meme Zone Balance')}
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {/* Energy Card */}
            <div className="bg-transparent rounded-[22px] p-3.5 flex flex-col items-center backdrop-blur-[2px]">
              <div className="flex items-center gap-1.5 text-[#56b6ff] text-[11.5px] font-black uppercase tracking-wider mb-1">
                
                <span>{t('shop.energy', 'Energy')}</span>
              </div>
              <div className="text-[26px] font-black text-white my-0.5 flex items-center gap-1">
                <span>{energy.toLocaleString()}</span>
                <span className="text-[#56b6ff] text-lg">⚡</span>
              </div>
              <button
                type="button"
                onClick={handleGetEnergy}
                className="mt-2.5 w-full py-2.5 rounded-[14px] bg-white text-black text-[12.5px] font-extrabold hover:bg-white/90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                + {t('shop.buy', 'Get Energy')}
              </button>
            </div>

            {/* Stars Card */}
            <div className="bg-transparent  rounded-[22px] p-3.5 flex flex-col items-center backdrop-blur-[2px]">
              <div className="flex items-center gap-1.5 text-[#f5a623] text-[11.5px] font-black uppercase tracking-wider mb-1">
               
                <span>{t('popups.stars', 'Stars')}</span>
              </div>
              <div className="text-[26px] font-black text-white my-0.5 flex items-center gap-1.5">
                <span>{stars.toLocaleString()}</span>
                <img src={starsIcon} alt="Stars" className="w-5 h-5 object-contain" />
              </div>
              <button
                type="button"
                onClick={handleTopupStars}
                className="mt-2.5 w-full py-2.5 rounded-[14px] bg-white text-black text-[12.5px] font-extrabold hover:bg-white/90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                + {t('profile.top_up', 'Top up')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content sheet */}
      <div className="bg-black -mt-3.5 rounded-t-[22px] relative z-2 px-4 pt-[18px]">
        {/* Profile row */}
        <ProfileHeader />

        {/* Pro Plan Status & Quota Usage */}
        <ProPlanStatusCard />

        {/* Meme history */}
        <MyMemes />

        {/* Invite Friends */}
        <InviteFriends />

        {/* Promo Code */}
        <PromoCode />
      </div>
    </div>
  )
}

export default Profile
