import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AuthScreen } from './components/AuthScreen'
import { TabBar } from './components/TabBar'
import { SavesPage } from './features/saves'
import { BuildPage, useBuild } from './features/build'
import { ComparePage } from './features/compare'
import { AccountPage } from './features/account'
import { CommunityPage } from './features/community/CommunityPage'
import type { SavedBuild } from './features/saves'
import { color, radius, layout, shadow } from './theme'

const shell: React.CSSProperties = {
  height: '100vh', width: '100vw',
  display: 'grid', placeItems: 'center',
  background: color.bgApp,
}

const panel: React.CSSProperties = {
  width: layout.panelWidth, height: layout.panelHeight,
  borderRadius: radius.xl,
  background: color.bgCard,
  overflow: 'hidden',
  boxShadow: shadow.panel,
  display: 'flex',
  flexDirection: 'column',
}

export function App() {
  const { session, loading } = useAuth()
  const { loadBuild } = useBuild()
  const navigate = useNavigate()

  if (loading) {
    return <div style={{ height: '100vh', width: '100vw', background: color.bgApp }} />
  }

  if (!session) {
    return <AuthScreen />
  }

  const handleLoadBuild = (saved: SavedBuild) => {
    loadBuild(saved.components)
    navigate('/build')
  }

  return (
    <div style={shell}>
      <div style={panel}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Routes>
            <Route path="/build"     element={<BuildPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/compare"   element={<ComparePage />} />
            <Route path="/saves"     element={<SavesPage onLoad={handleLoadBuild} />} />
            <Route path="/account"   element={<AccountPage />} />
            <Route path="/" element={<Navigate to="/build" replace />} />
          </Routes>
        </div>
        <TabBar />
      </div>
    </div>
  )
}
