import { NavLink, useLocation } from 'react-router-dom'
import { Zap, Home, ShoppingBag, User, ImagePlus } from 'lucide-react'
import { motion } from 'framer-motion'
import LiquidGlass from 'liquid-glass-react'

export function BottomNav() {
  const location = useLocation()

  const navItems = [
    { path: '/shop', label: 'Shop', icon: ShoppingBag, disabled: false },
    { path: '/', label: 'Home', icon: Home, disabled: false },
    { path: '/tasks', label: 'Task', icon: Zap, disabled: false },
    { path: '/profile', label: 'Profile', icon: User, disabled: false },
  ]

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-[calc(1.55rem+env(safe-area-inset-bottom))] z-50 pointer-events-none px-[13px]"
    >
      <div className="max-w-[388px] mx-auto flex items-end gap-[10px]">
        {/* Editor Button (Left) */}
        <NavLink
          to="/editor"
          className="pointer-events-auto shrink-0 w-[68px] h-[68px] rounded-full shadow-[0_10px_24px_rgba(0,0,0,0.7)] transition-all relative overflow-hidden"
        >
          {({ isActive }) => (
            <LiquidGlass
              cornerRadius={34}
              displacementScale={48}
              blurAmount={0.12}
              saturation={135}
              aberrationIntensity={1.5}
              padding="0"
              className={`w-full h-full ${
                isActive ? 'shadow-[0_0_15px_rgba(34,158,217,0.24)]' : ''
              }`}
              style={{ position: 'absolute', top: '50%', left: '50%', border: 0, outline: 0 }}
            >
              <div
                className={`w-[68px] h-[68px] rounded-full flex items-center justify-center transition-colors bg-[#15161a]/85 shadow-[inset_0_-1px_0_rgba(0,0,0,0.55)] outline-none ${
                  isActive
                    ? 'text-[#229ED9]'
                    : 'text-[#9a9da3] hover:text-[#d6d8dd]'
                }`}
              >
                <ImagePlus className="w-[29px] h-[22px]" strokeWidth={2} />
              </div>
            </LiquidGlass>
          )}
        </NavLink>

        {/* Main Nav Bar */}
        <div className="pointer-events-auto flex-1 min-w-0 h-[72px] rounded-[36px] shadow-[0_10px_24px_rgba(0,0,0,0.72)] relative overflow-hidden border-0 outline-none [&_*]:border-0 [&_*]:outline-none">
          <LiquidGlass
            cornerRadius={36}
            displacementScale={48}
            blurAmount={0.12}
            saturation={135}
            aberrationIntensity={1.5}
            padding="0"
            className="w-full h-full"
            style={{ position: 'absolute', top: '50%', left: '50%', border: 0, outline: 0 }}
          >
            <div className="w-[calc(100vw-104px)] max-w-[320px] h-[72px] rounded-[36px] bg-[#15161a]/85 shadow-[inset_0_-1px_0_rgba(0,0,0,0.55)]">
              <div className="relative z-10 w-full h-full flex items-center justify-between px-[8px]">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  const Icon = item.icon
                  const disabled = item.disabled

                  const content = (
                    <>
                      {!disabled && isActive && (
                        <motion.div
                          layoutId="active-nav-capsule"
                          className="absolute inset-0 rounded-[31px] bg-white/[0.055] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_18px_rgba(0,0,0,0.18)]"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      {disabled && (
                        <span className="absolute left-1/2 top-[19px] z-20 min-w-[46px] -translate-x-1/2 rounded-md bg-[#229ED9] px-2 py-1 text-center text-[10px] font-extrabold uppercase leading-none text-white shadow-[0_4px_12px_rgba(34,158,217,0.35)]">
                          Soon
                        </span>
                      )}
                      <Icon
                        className={`relative z-10 mb-[7px] h-[25px] w-[25px] ${!disabled && isActive ? 'drop-shadow-[0_0_7px_rgba(34,158,217,0.62)]' : ''}`}
                        strokeWidth={!disabled && isActive ? 2.5 : 2}
                      />
                      <span className="relative z-10 text-[11px] font-medium leading-none tracking-normal">
                        {item.label}
                      </span>
                    </>
                  )

                  if (disabled) {
                    return (
                      <button
                        key={item.path}
                        type="button"
                        disabled
                        aria-disabled="true"
                        className="relative flex h-[62px] w-[70px] flex-col items-center justify-center rounded-[31px] font-sans text-[#a5a8ae]/60 cursor-not-allowed"
                      >
                        {content}
                      </button>
                    )
                  }

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`relative flex h-[62px] w-[70px] flex-col items-center justify-center rounded-[31px] font-sans transition-colors ${
                        isActive ? 'text-[#229ED9]' : 'text-[#a5a8ae] hover:text-[#d9dbe0]'
                      }`}
                    >
                      {content}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          </LiquidGlass>
        </div>
      </div>
    </nav>
  )
}
