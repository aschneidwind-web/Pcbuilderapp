import type { CatalogOption, CatalogSlot, SlotKey } from './build.types'

interface Props {
  slotKey: SlotKey
  slot: CatalogSlot
  selected: CatalogOption | undefined
  onClick: () => void
}

// Gradient pairs per slot key — used for the icon background when selected
const GRADIENTS: Record<SlotKey, [string, string]> = {
  cpu:         ['#7B2FFF', '#A855F7'],
  cooler:      ['#10B981', '#34D399'],
  gpu:         ['#FF6B9D', '#FF8FAD'],
  motherboard: ['#6366F1', '#818CF8'],
  ram:         ['#F59E0B', '#FBBF24'],
  storage:     ['#06B6D4', '#22D3EE'],
  psu:         ['#EF4444', '#F87171'],
  case:        ['#8B5CF6', '#A78BFA'],
}

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14" style={{ color: '#4A4A5A' }}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export function ComponentRow({ slotKey, slot, selected, onClick }: Props) {
  const [g1, g2] = GRADIENTS[slotKey]
  const gradId = `grad-${slotKey}`

  const iconBg = selected
    ? `linear-gradient(135deg, ${g1}, ${g2})`
    : 'rgba(255,255,255,0.06)'

  return (
    <div style={s.row} onClick={onClick}>
      <div
        style={{ ...s.icon, background: iconBg }}
      >
        {/* Inline the SVG via a small wrapper so we get gradient bg + white icon */}
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          style={{ display: 'block' }}
          dangerouslySetInnerHTML={{ __html: slot.icon.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '') }}
        />
      </div>

      <div style={s.info}>
        <div style={selected ? s.label : s.labelDim}>{slot.label}</div>
        {selected && (
          <div style={{ ...s.partName, color: g1 }}>{selected.n}</div>
        )}
      </div>

      <div style={s.right}>
        {selected && <span style={s.price}>${selected.p}</span>}
        <ChevronIcon />
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 20px',
    cursor: 'pointer',
    borderBottom: '0.5px solid rgba(255,255,255,0.04)',
    transition: 'background 0.15s',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  labelDim: {
    fontSize: 14,
    fontWeight: 500,
    color: '#6B6B80',
  },
  partName: {
    fontSize: 12,
    fontWeight: 400,
    marginTop: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  price: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    letterSpacing: '-0.3px',
  },
}
