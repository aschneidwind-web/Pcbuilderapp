import type { CatalogOption, CatalogSlot } from './build.types'

interface Props {
  slot: CatalogSlot
  selected: CatalogOption | undefined
  onSelect: (option: CatalogOption) => void
  onClose: () => void
}

export function ComponentPicker({ slot, selected, onSelect, onClose }: Props) {
  let maxPtp = 0
  for (const o of slot.opts) {
    if (o.pm) {
      const ptp = Math.round(o.pm / o.p)
      if (ptp > maxPtp) maxPtp = ptp
    }
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.sheet} onClick={e => e.stopPropagation()}>
        <div style={s.header}>
          <button style={s.back} onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" width="20" height="20">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span style={s.title}>{slot.label}</span>
          <div style={{ width: 32 }} />
        </div>

        <div style={s.list}>
          {slot.opts.map(opt => {
            const ptp = opt.pm ? Math.round(opt.pm / opt.p) : null
            const isBestValue = ptp != null && ptp === maxPtp
            const isSel = selected === opt

            return (
              <div
                key={opt.n}
                style={{ ...s.optRow, ...(isSel ? s.optRowSel : {}) }}
                onClick={() => { onSelect(opt); onClose() }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={s.optName}>
                    {opt.n}
                    {isBestValue && <span style={s.badge}>best value</span>}
                  </div>
                  <div style={s.optSpec}>{opt.s}</div>
                </div>
                <div style={s.optRight}>
                  <span style={s.optPrice}>${opt.p}</span>
                  {ptp && <span style={s.optPts}>{ptp} pts/$</span>}
                </div>
                {isSel && (
                  <div style={{ color: '#6B6B80', flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="16" height="16">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    display: 'flex',
    alignItems: 'flex-end',
    zIndex: 10,
  },
  sheet: {
    width: '100%',
    background: '#111118',
    borderRadius: '16px 16px 0 0',
    maxHeight: '85%',
    display: 'flex',
    flexDirection: 'column',
    border: '0.5px solid rgba(255,255,255,0.08)',
    borderBottom: 'none',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px 12px',
    borderBottom: '0.5px solid rgba(255,255,255,0.08)',
    flexShrink: 0,
  },
  back: {
    background: 'none',
    border: 'none',
    color: '#A78BFA',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
  },
  list: {
    overflowY: 'auto',
    flex: 1,
    padding: '0 16px',
  },
  optRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 0',
    borderBottom: '0.5px solid rgba(255,255,255,0.05)',
    cursor: 'pointer',
  },
  optRowSel: {
    margin: '0 -16px',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.04)',
  },
  optName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#fff',
    marginBottom: 2,
  },
  optSpec: {
    fontSize: 12,
    color: '#6B6B80',
  },
  optRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 2,
    flexShrink: 0,
  },
  optPrice: {
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
  },
  optPts: {
    fontSize: 11,
    color: '#6B6B80',
  },
  badge: {
    display: 'inline-block',
    marginLeft: 6,
    fontSize: 10,
    fontWeight: 600,
    color: '#10B981',
    background: 'rgba(16,185,129,0.15)',
    borderRadius: 5,
    padding: '1px 5px',
  },
}
