import { color, font } from '../../theme'

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
    background: color.bgApp, zIndex: 10, overflowY: 'auto',
    fontFamily: font.family,
  },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: color.borderSubtle,
  },
  back: {
    display: 'flex', alignItems: 'center', gap: 4,
    background: 'none', border: 'none', color: color.primary,
    fontSize: font.size.lg, cursor: 'pointer', padding: 0,
  },
  title: { fontSize: font.size.lg, fontWeight: font.weight.semibold, color: color.textPrimary },
  body:  { padding: '16px 16px 32px' },
}
