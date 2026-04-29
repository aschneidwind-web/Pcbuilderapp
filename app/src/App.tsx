import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AuthScreen } from './components/AuthScreen'
import { SavesPage } from './features/saves'
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

  if (loading) {
    return <div style={{ height: '100vh', width: '100vw', background: '#0b0b0e' }} />
  }

  if (!session) {
    return <AuthScreen />
  }

  return (
    <div style={shell}>
      <div style={panel}>
        <Routes>
          <Route path="/saves" element={<SavesPage />} />
          <Route
            path="*"
            element={
              <iframe
                title="PC Builder"
                srcDoc={legacyHtml}
                style={{ width: '100%', height: '100%', border: 0 }}
              />
            }
          />
        </Routes>
      </div>
    </div>
  )
}
