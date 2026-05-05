import { useState } from 'react'
import { CATALOG } from '../build/build.catalog'
import { SLOT_KEYS } from '../build/build.types'
import type { SlotKey } from '../build/build.types'
import type { SortMode } from './compare.types'
import { toComparable, sortByMode, sortByPrice } from './compare.utils'
import { CompareCard } from './CompareCard'

const SORT_MODES: { id: SortMode; label: string }[] = [
  { id: 'value', label: 'Best value' },
  { id: 'perf',  label: 'Performance' },
  { id: 'price', label: 'Price' },
]

export function ComparePage() {
  const [slot, setSlot]   = useState<SlotKey>('cpu')
  const [sort, setSort]   = useState<SortMode>('value')

  const cat    = CATALOG[slot]
  const hasPM  = cat.hasPM

  const cards = hasPM
    ? (() => {
        const items = cat.opts.map(toComparable)
        const sorted = sortByMode(items, sort)
        const maxPm  = Math.max(...sorted.map(o => o.pm))
        const maxPtp = Math.max(...sorted.map(o => o.ptp))
        return sorted.map((opt, i) => (
          <CompareCard key={opt.n} variant="pm" opt={opt} rank={i} maxPm={maxPm} maxPtp={maxPtp} sort={sort} />
        ))
      })()
    : sortByPrice(cat.opts).map((opt, i) => (
        <CompareCard key={opt.n} variant="price" n={opt.n} s={opt.s} p={opt.p} rank={i} />
      ))

  return (
    <div style={s.page}>
      <div style={s.navbar}>
        <div style={s.navTitle}>Compare</div>
        <div style={s.navSub}>{cat.label} comparison</div>
      </div>

      <div style={s.scroll}>
        <div style={s.selectWrap}>
          <select
            style={s.select}
            value={slot}
            onChange={e => setSlot(e.target.value as SlotKey)}
          >
            {SLOT_KEYS.map(key => (
              <option key={key} value={key}>{CATALOG[key].label}</option>
            ))}
          </select>
          <div style={s.chevron}>
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="#8E8E93" strokeWidth={2} strokeLinecap="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {hasPM && (
          <div style={s.sortRow}>
            {SORT_MODES.map(({ id, label }) => (
              <button
                key={id}
                style={{ ...s.sortBtn, ...(sort === id ? s.sortBtnOn : {}) }}
                onClick={() => setSort(id)}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div>{cards}</div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    height: '100%', display: 'flex', flexDirection: 'column',
    background: '#0b0b0e', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  navbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 16px 12px',
    borderBottom: '0.5px solid rgba(255,255,255,0.08)',
    flexShrink: 0,
  },
  navTitle: { fontSize: 17, fontWeight: 600, color: '#fff' },
  navSub:   { fontSize: 13, color: '#8E8E93' },
  scroll:   { flex: 1, overflowY: 'auto', padding: '14px 16px' },
  selectWrap: { position: 'relative', marginBottom: 14 },
  select: {
    width: '100%', padding: '12px 40px 12px 14px',
    fontSize: 14, fontWeight: 500, color: '#f2f2f7',
    background: '#1c1c1e', border: '0.5px solid rgba(255,255,255,0.12)',
    borderRadius: 12, appearance: 'none', cursor: 'pointer', outline: 'none',
  },
  chevron: {
    position: 'absolute', right: 12, top: '50%',
    transform: 'translateY(-50%)', pointerEvents: 'none',
  },
  sortRow: { display: 'flex', gap: 8, marginBottom: 14 },
  sortBtn: {
    flex: 1, padding: '7px 4px', fontSize: 12, fontWeight: 500,
    border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 9,
    background: 'none', cursor: 'pointer', color: '#AEAEB2',
  },
  sortBtnOn: {
    background: 'rgba(10,132,255,0.15)', color: '#0A84FF',
    border: '0.5px solid #0A84FF',
  },
}
