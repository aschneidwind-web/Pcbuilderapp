import { useLocation, useNavigate } from 'react-router-dom'

const TABS = [
  {
    route: '/build',
    label: 'Build',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? '#0A84FF' : '#8E8E93'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="8" height="8" rx="1.5"/>
        <rect x="13" y="3" width="8" height="8" rx="1.5"/>
        <rect x="3" y="13" width="8" height="8" rx="1.5"/>
        <rect x="13" y="13" width="8" height="8" rx="1.5"/>
      </svg>
    ),
  },
  {
    route: '/community',
    label: 'Community',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? '#0A84FF' : '#8E8E93'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    route: '/compare',
    label: 'Compare',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? '#0A84FF' : '#8E8E93'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6"  y1="20" x2="6"  y2="14"/>
      </svg>
    ),
  },
  {
    route: '/saves',
    label: 'Saves',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? '#0A84FF' : '#8E8E93'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
        <polyline points="17 21 17 13 7 13 7 21"/>
        <polyline points="7 3 7 8 15 8"/>
      </svg>
    ),
  },
  {
    route: '/account',
    label: 'Account',
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? '#0A84FF' : '#8E8E93'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
]

export function TabBar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <div style={s.bar}>
      {TABS.map(tab => {
        const active = pathname === tab.route
        return (
          <button key={tab.route} style={s.tab} onClick={() => navigate(tab.route)}>
            {tab.icon(active)}
            <span style={{ ...s.label, color: active ? '#0A84FF' : '#8E8E93' }}>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  bar: {
    flexShrink: 0,
    height: 52,
    background: '#1c1c1e',
    borderTop: '0.5px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 0',
  },
  label: {
    fontSize: 10,
    fontWeight: 500,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
}
