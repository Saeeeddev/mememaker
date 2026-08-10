import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@components/layout/AppShell'
import { TopupPopup } from '@components/popups/TopupPopup'
import { SettingsPopup } from '@components/popups/SettingsPopup'
import HomePage from '@pages/Home'
import ProfilePage from '@pages/Profile'
import TasksPage from '@pages/Tasks'
import ShopPage from '@pages/Shop'
import EditorPage from '@pages/Editor'
import LoadingLogo from '@components/ui/LoadingLogofirst'

const SPLASH_DURATION = 2000 // 2 seconds

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Start fade-out 400ms before unmounting so transition is smooth
    const fadeTimer = setTimeout(() => setFadeOut(true), SPLASH_DURATION - 400)
    const hideTimer = setTimeout(() => setShowSplash(false), SPLASH_DURATION)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  return (
    <>
      {/* ── App renders immediately underneath the splash so it's ready when splash fades ── */}
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Route>
      </Routes>

      {/* Global popups — rendered outside routes to persist across navigation */}
      <TopupPopup />
      <SettingsPopup />

      {/* ── Splash overlay sits on top; fades out after SPLASH_DURATION then unmounts ── */}
      {showSplash && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
            background: '#000000',
            opacity: fadeOut ? 0 : 1,
            WebkitTransition: 'opacity 0.4s ease',
            transition: 'opacity 0.4s ease',
            pointerEvents: fadeOut ? 'none' : 'all',
          }}
        >
          <LoadingLogo />
        </div>
      )}
    </>
  )
}

export default App
