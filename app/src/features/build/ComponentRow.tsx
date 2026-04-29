import type { CatalogOption, CatalogSlot } from './build.types'

interface Props {
  slot: CatalogSlot
  selected: CatalogOption | undefined
  onClick: () => void
}

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="20" height="20">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="14" height="14">
    <polyline points="2,6 5,9 10,3" />
  </svg>
)

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export function ComponentRow({ slot, selected, onClick }: Props) {
  return (
    <div style={s.row} onClick={onClick}>
      <div
        style={{ ...s.icon, background: slot.ib, color: slot.ic }}
        dangerouslySetInnerHTML={{ __html: slot.icon }}
      />
      <div style={s.info}>
        <div style={s.cat}>{slot.label}</div>
        {selected ? (
          <>
            <div style={s.name}>{selected.n}</div>
            <div style={s.spec}>{selected.s}</div>
          </>
        ) : (
          <div style={s.empty}>Choose {slot.label}</div>
        )}
      </div>
      <div style={s.right}>
        {selected && <span style={s.price}>${selected.p}</span>}
        <div style={{ color: selected ? '#34C759' : '#636366' }}>
          {selected ? <CheckIcon /> : <PlusIcon />}
        </div>
        <div style={{ color: '#636366' }}>
          <ChevronIcon />
        </div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '11px 0', cursor: 'pointer',
    borderBottom: '0.5px solid rgba(255,255,255,0.07)',
  },
  icon: {
    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1, minWidth: 0 },
  cat:   { fontSize: 11, color: '#8E8E93', marginBottom: 2 },
  name:  { fontSize: 13, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  spec:  { fontSize: 11, color: '#8E8E93', marginTop: 1 },
  empty: { fontSize: 13, color: '#636366' },
  right: { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 },
  price: { fontSize: 13, fontWeight: 500, color: '#fff' },
}
