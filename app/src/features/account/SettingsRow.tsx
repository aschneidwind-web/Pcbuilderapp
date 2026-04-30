interface RowProps {
  iconBg: string
  iconColor: string
  icon: React.ReactNode
  label: string
  value?: string
  onClick?: () => void
  danger?: boolean
  right?: React.ReactNode
}

export function SettingsRow({ iconBg, iconColor, icon, label, value, onClick, danger, right }: RowProps) {
  return (
    <div style={s.row} onClick={onClick}>
      <div style={s.left}>
        <div style={{ ...s.ico, background: iconBg, color: iconColor }}>{icon}</div>
        <span style={danger ? s.dangerLabel : s.label}>{label}</span>
      </div>
      <div style={s.rightWrap}>
        {value && <span style={s.value}>{value}</span>}
        {right ?? (onClick && <span style={s.arrow}>›</span>)}
      </div>
    </div>
  )
}

interface GroupProps { children: React.ReactNode; style?: React.CSSProperties }

export function SettingsGroup({ children, style }: GroupProps) {
  return <div style={{ ...s.group, ...style }}>{children}</div>
}

interface ToggleProps { on: boolean; onToggle: () => void }

export function Toggle({ on, onToggle }: ToggleProps) {
  return (
    <button onClick={e => { e.stopPropagation(); onToggle() }} style={{ ...s.toggle, background: on ? '#34C759' : 'rgba(255,255,255,0.18)' }}>
      <div style={{ ...s.thumb, left: on ? 20 : 2 }} />
    </button>
  )
}

const s: Record<string, React.CSSProperties> = {
  group: {
    background: '#1c1c1e', borderRadius: 14,
    border: '0.5px solid rgba(255,255,255,0.12)',
    marginBottom: 12, overflow: 'hidden',
  },
  row: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '13px 16px',
    borderBottom: '0.5px solid rgba(255,255,255,0.08)',
    cursor: 'pointer',
  },
  left:  { display: 'flex', alignItems: 'center', gap: 10 },
  ico: {
    width: 30, height: 30, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  label:       { fontSize: 14, color: '#f2f2f7' },
  dangerLabel: { fontSize: 14, color: '#FF453A' },
  rightWrap:   { display: 'flex', alignItems: 'center', gap: 6 },
  value:       { fontSize: 13, color: '#8E8E93' },
  arrow:       { fontSize: 18, color: '#8E8E93' },
  toggle: {
    width: 44, height: 26, borderRadius: 13, position: 'relative',
    cursor: 'pointer', border: 'none', flexShrink: 0, transition: 'background 0.2s',
  },
  thumb: {
    width: 22, height: 22, background: '#fff', borderRadius: '50%',
    position: 'absolute', top: 2, transition: 'left 0.2s',
  },
}
