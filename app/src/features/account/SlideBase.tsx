interface Props {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export function SlideBase({ title, onClose, children }: Props) {
  return (
    <div style={s.overlay}>
      <div style={s.nav}>
        <button style={s.back} onClick={onClose}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <span style={s.title}>{title}</span>
        <div style={{ width: 50 }} />
      </div>
      <div style={s.body}>{children}</div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    background: '#0b0b0e', zIndex: 10, overflowY: 'auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '0.5px solid rgba(255,255,255,0.08)',
  },
  back: {
    display: 'flex', alignItems: 'center', gap: 4,
    background: 'none', border: 'none', color: '#0A84FF',
    fontSize: 15, cursor: 'pointer', padding: 0,
  },
  title: { fontSize: 15, fontWeight: 600, color: '#fff' },
  body:  { padding: '16px 16px 32px' },
}
