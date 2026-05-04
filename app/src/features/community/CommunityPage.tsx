export function CommunityPage() {
  return (
    <div style={s.page}>
      <div style={s.navbar}>
        <div style={s.navTitle}>Community</div>
      </div>
      <div style={s.body}>
        <div style={s.iconWrap}>
          <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#3A3A3C" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div style={s.heading}>Coming soon</div>
        <div style={s.sub}>Browse and share builds with the community.</div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    height: '100%', display: 'flex', flexDirection: 'column',
    background: '#0b0b0e',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  navbar: {
    padding: '16px 16px 12px',
    borderBottom: '0.5px solid rgba(255,255,255,0.08)',
    flexShrink: 0,
  },
  navTitle: { fontSize: 17, fontWeight: 600, color: '#fff' },
  body: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 12,
    paddingBottom: 52,
  },
  iconWrap: {
    width: 72, height: 72, borderRadius: 20,
    background: '#1c1c1e',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  heading: { fontSize: 17, fontWeight: 600, color: '#fff' },
  sub:     { fontSize: 14, color: '#8E8E93', textAlign: 'center', maxWidth: 220 },
}
