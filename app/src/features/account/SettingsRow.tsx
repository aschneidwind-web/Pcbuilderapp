import { color, radius, font } from '../../theme'

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
    <button onClick={e => { e.stopPropagation(); onToggle() }} style={{ ...s.toggle, background: on ? color.success : 'rgba(255,255,255,0.18)' }}>
      <div style={{ ...s.thumb, left: on ? 20 : 2 }} />
    </button>
  )
}

const s: Record<string, React.CSSProperties> = {
  group: {
    background: color.bgCard, borderRadius: radius.lg,
    border: color.border,
    marginBottom: 12, overflow: 'hidden',
  },
  row: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '13px 16px',
    borderBottom: color.borderSubtle,
    cursor: 'pointer',
  },
  left:  { display: 'flex', alignItems: 'center', gap: 10 },
  ico: {
    width: 30, height: 30, borderRadius: radius.sm,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  label:       { fontSize: font.size.base, color: color.textPrimary },
  dangerLabel: { fontSize: font.size.base, color: color.error },
  rightWrap:   { display: 'flex', alignItems: 'center', gap: 6 },
  value:       { fontSize: font.size.body, color: color.textTertiary },
  arrow:       { fontSize: 18, color: color.textTertiary },
  toggle: {
    width: 44, height: 26, borderRadius: 13, position: 'relative',
    cursor: 'pointer', border: 'none', flexShrink: 0, transition: 'background 0.2s',
  },
  thumb: {
    width: 22, height: 22, background: color.textPrimary, borderRadius: '50%',
    position: 'absolute', top: 2, transition: 'left 0.2s',
  },
}
