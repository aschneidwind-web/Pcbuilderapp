import { useRef } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AuthScreen } from './components/AuthScreen'
import { SavesPage } from './features/saves'
import { BuildPage, useBuild } from './features/build'
import type { SavedBuild } from './features/saves'
import legacyHtml from './legacy/prototype.html?raw'

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
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleIframeLoad = () => {
    if (!iframeRef.current || !session) return
    const u = session.user
    iframeRef.current.contentWindow?.postMessage({
      type: 'SUPABASE_SESSION',
      user: {
        name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User',
        email: u.email || '',
        bio: '',
        avatarIdx: 0,
        joined: new Date().toLocaleDateString(),
      }
    }, '*')
  }

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
          <Route path="/build"  element={<BuildPage />} />
          <Route path="/saves"  element={<SavesPage onLoad={handleLoadBuild} />} />
          <Route
            path="*"
            element={
              <iframe
                ref={iframeRef}
                title="PC Builder"
                srcDoc={legacyHtml}
                style={{ width: '100%', height: '100%', border: 0 }}
                onLoad={handleIframeLoad}
              />
            }
          />
        </Routes>
      </div>
    </div>
  )
}
