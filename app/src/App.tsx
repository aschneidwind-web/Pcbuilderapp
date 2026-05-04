import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AuthScreen } from './components/AuthScreen'
import { SavesPage } from './features/saves'
import { BuildPage, useBuild } from './features/build'
import { ComparePage } from './features/compare'
import { AccountPage } from './features/account'
import type { SavedBuild } from './features/saves'

const shell: React.CSSProperties = {
  height: '100vh', width: '100vw',
  display: 'grid', placeItems: 'center',
  background: '#0b0b0e',
}

const panel: React.CSSProperties = {
  width: 420, height: 700,
  borderRadius: 18,
  background: '#1c1c1e',
  overflow: 'hidden',
  boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
}

export function App() {
  const { session, loading } = useAuth()
  const { loadBuild } = useBuild()
  const navigate = useNavigate()

  if (loading) {
    return <div style={{ height: '100vh', width: '100vw', background: '#0b0b0e' }} />
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
        <Routes>
          <Route path="/build"   element={<BuildPage />} />
          <Route path="/saves"   element={<SavesPage onLoad={handleLoadBuild} />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/" element={<Navigate to="/build" replace />} />
        </Routes>
      </div>
    </div>
  )
}
