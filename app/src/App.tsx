import legacyHtml from './legacy/prototype.html?raw'

export function App() {
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'grid', placeItems: 'center', background: '#0b0b0e' }}>
      <iframe
        title="PC Builder prototype"
        srcDoc={legacyHtml}
        style={{
          width: 420,
          height: 700,
          border: '0',
          borderRadius: 18,
          background: 'transparent',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
        }}
      />
    </div>
  )
}

