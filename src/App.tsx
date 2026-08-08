import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@components/layout/AppShell'
import { TopupPopup } from '@components/popups/TopupPopup'
import { SettingsPopup } from '@components/popups/SettingsPopup'
import HomePage from '@pages/Home'
import ProfilePage from '@pages/Profile'
import TasksPage from '@pages/Tasks'
import ShopPage from '@pages/Shop'
import EditorPage from '@pages/Editor'

function App() {
  return (
    <>
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
    </>
  )
}

export default App
