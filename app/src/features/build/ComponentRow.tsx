import type { CatalogOption, CatalogSlot, SlotKey } from './build.types'
import { color, radius, font } from '../../theme'

interface Props {
  slotKey: SlotKey
  slot: CatalogSlot
  selected: CatalogOption | undefined
  onClick: () => void
}

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14" style={{ color: color.textDisabled }}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

export function ComponentRow({ slotKey: _slotKey, slot, selected, onClick }: Props) {
  return (
    <div style={s.row} onClick={onClick}>
      <div style={{ ...s.icon, background: color.primary }}>
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke={slot.ic}
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ display: 'block' }}
          dangerouslySetInnerHTML={{ __html: slot.icon.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '') }}
        />
      </div>

      <div style={s.info}>
        <div style={selected ? s.label : s.labelDim}>{slot.label}</div>
        {selected && <div style={s.partName}>{selected.n}</div>}
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
    borderBottom: color.borderFaint,
    transition: 'background 0.15s',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: font.size.base,
    fontWeight: font.weight.medium,
    color: color.textPrimary,
  },
  labelDim: {
    fontSize: font.size.base,
    fontWeight: font.weight.medium,
    color: color.textDim,
  },
  partName: {
    fontSize: font.size.md,
    fontWeight: font.weight.normal,
    color: color.textSecondary,
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
    fontSize: font.size.base,
    fontWeight: font.weight.semibold,
    color: color.textPrimary,
    letterSpacing: '-0.3px',
  },
}
