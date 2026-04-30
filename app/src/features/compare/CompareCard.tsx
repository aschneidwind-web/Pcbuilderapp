import type { SortMode, ComparableOption } from './compare.types'

interface PmProps {
  variant: 'pm'
  opt: ComparableOption
  rank: number
  maxPm: number
  maxPtp: number
  sort: SortMode
}

interface PriceProps {
  variant: 'price'
  n: string
  s: string
  p: number
  rank: number
}

type Props = PmProps | PriceProps

function winnerLabel(sort: SortMode): string {
  if (sort === 'value') return 'Top value'
  if (sort === 'perf')  return 'Top performer'
  return 'Best price'
}

function Bar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div style={s.barRow}>
      <span style={s.barLabel}>{label}</span>
      <div style={s.barTrack}>
        <div style={{ ...s.barFill, width: `${pct}%`, background: color }} />
      </div>
      <span style={s.barPct}>{pct}%</span>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={s.stat}>
      <div style={s.statVal}>{value}</div>
      <div style={s.statLabel}>{label}</div>
    </div>
  )
}

export function CompareCard(props: Props) {
  const isWinner = props.rank === 0
  const cardStyle = { ...s.card, ...(isWinner ? s.winner : {}) }

  if (props.variant === 'price') {
    return (
      <div style={cardStyle}>
        {isWinner && <div style={s.badge}>Best price</div>}
        <div style={s.head}>
          <div>
            <div style={s.name}>{props.n}</div>
            <div style={s.spec}>{props.s}</div>
          </div>
          <div style={s.price}>${props.p}</div>
        </div>
        <div style={s.statsRow}>
          <Stat value={`$${props.p}`} label="Price" />
          <Stat value={`#${props.rank + 1}`} label="rank" />
        </div>
      </div>
    )
  }

  const { opt, maxPm, maxPtp, sort } = props
  const perfPct  = Math.round((opt.pm  / maxPm)  * 100)
  const valuePct = Math.round((opt.ptp / maxPtp) * 100)

  return (
    <div style={cardStyle}>
      {isWinner && <div style={s.badge}>{winnerLabel(sort)}</div>}
      <div style={s.head}>
        <div>
          <div style={s.name}>{opt.n}</div>
          <div style={s.spec}>{opt.s}</div>
        </div>
        <div style={s.price}>${opt.p}</div>
      </div>
      <Bar label="Performance" pct={perfPct}  color="#0A84FF" />
      <Bar label="Value score" pct={valuePct} color="#34C759" />
      <div style={s.statsRow}>
        <Stat value={opt.pm.toLocaleString()} label="PassMark" />
        <Stat value={String(opt.ptp)}         label="pts per $" />
        <Stat value={`#${props.rank + 1}`}    label="rank" />
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  card: {
    background: '#1c1c1e', borderRadius: 14,
    border: '0.5px solid rgba(255,255,255,0.12)',
    padding: 14, marginBottom: 10,
  },
  winner: { border: '2px solid #34C759' },
  badge: {
    display: 'inline-block', fontSize: 10, fontWeight: 500,
    background: 'rgba(52,199,89,0.15)', color: '#30d158',
    padding: '2px 8px', borderRadius: 20, marginBottom: 8,
  },
  head: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 10, gap: 8,
  },
  name:  { fontSize: 14, fontWeight: 500, color: '#f2f2f7' },
  spec:  { fontSize: 11, color: '#AEAEB2', marginTop: 2 },
  price: { fontSize: 16, fontWeight: 500, color: '#f2f2f7', whiteSpace: 'nowrap' },
  barRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 },
  barLabel: { fontSize: 11, color: '#AEAEB2', width: 80, flexShrink: 0 },
  barTrack: { flex: 1, height: 5, background: '#2c2c2e', borderRadius: 3, overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: 3 },
  barPct:   { fontSize: 11, color: '#AEAEB2', width: 40, textAlign: 'right', flexShrink: 0 },
  statsRow: {
    display: 'flex', marginTop: 12, paddingTop: 10,
    borderTop: '0.5px solid rgba(255,255,255,0.08)',
  },
  stat:      { flex: 1, textAlign: 'center' },
  statVal:   { fontSize: 14, fontWeight: 500, color: '#f2f2f7' },
  statLabel: { fontSize: 10, color: '#AEAEB2', marginTop: 1 },
}
