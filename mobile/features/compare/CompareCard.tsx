import { View, Text, StyleSheet } from 'react-native'
import type { SortMode, ComparableOption } from './compare.types'
import { color, font, radius } from '../../theme'

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

function Bar({ label, pct, barColor }: { label: string; pct: number; barColor: string }) {
  return (
    <View style={s.barRow}>
      <Text style={s.barLabel}>{label}</Text>
      <View style={s.barTrack}>
        <View style={[s.barFill, { width: `${pct}%` as `${number}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={s.barPct}>{pct}%</Text>
    </View>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={s.stat}>
      <Text style={s.statVal}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  )
}

export function CompareCard(props: Props) {
  const isWinner = props.rank === 0
  const cardStyle = [s.card, isWinner && s.winner]

  if (props.variant === 'price') {
    return (
      <View style={cardStyle}>
        {isWinner && <Text style={s.badge}>Best price</Text>}
        <View style={s.head}>
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{props.n}</Text>
            <Text style={s.spec}>{props.s}</Text>
          </View>
          <Text style={s.price}>${props.p}</Text>
        </View>
        <View style={s.statsRow}>
          <Stat value={`$${props.p}`} label="Price" />
          <Stat value={`#${props.rank + 1}`} label="rank" />
        </View>
      </View>
    )
  }

  const { opt, maxPm, maxPtp, sort } = props
  const perfPct  = Math.round((opt.pm  / maxPm)  * 100)
  const valuePct = Math.round((opt.ptp / maxPtp) * 100)

  return (
    <View style={cardStyle}>
      {isWinner && <Text style={s.badge}>{winnerLabel(sort)}</Text>}
      <View style={s.head}>
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{opt.n}</Text>
          <Text style={s.spec}>{opt.s}</Text>
        </View>
        <Text style={s.price}>${opt.p}</Text>
      </View>
      <Bar label="Performance" pct={perfPct}  barColor={color.info} />
      <Bar label="Value score" pct={valuePct} barColor={color.success} />
      <View style={s.statsRow}>
        <Stat value={opt.pm.toLocaleString()} label="PassMark" />
        <Stat value={String(opt.ptp)}         label="pts per $" />
        <Stat value={`#${props.rank + 1}`}    label="rank" />
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  card: {
    backgroundColor: color.bgCard,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: color.border,
    padding: 14,
    marginBottom: 10,
  },
  winner: { borderWidth: 2, borderColor: color.success },
  badge: {
    fontSize: font.size.xs,
    fontWeight: font.weight.medium,
    backgroundColor: color.successBg,
    color: color.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  name:  { fontSize: font.size.base, fontWeight: font.weight.medium, color: color.textPrimary },
  spec:  { fontSize: font.size.sm, color: color.textSecondary, marginTop: 2 },
  price: { fontSize: font.size.xl, fontWeight: font.weight.medium, color: color.textPrimary },
  barRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  barLabel: { fontSize: font.size.sm, color: color.textSecondary, width: 80 },
  barTrack: { flex: 1, height: 5, backgroundColor: color.bgInput, borderRadius: 3, overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: 3 },
  barPct:   { fontSize: font.size.sm, color: color.textSecondary, width: 40, textAlign: 'right' },
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: color.borderSubtle,
  },
  stat:      { flex: 1, alignItems: 'center' },
  statVal:   { fontSize: font.size.base, fontWeight: font.weight.medium, color: color.textPrimary },
  statLabel: { fontSize: font.size.xs, color: color.textSecondary, marginTop: 1 },
})
