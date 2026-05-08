import { useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { BuildState } from './build.types'
import {
  computeBuildScore, getTier, getCategoryScores, getUpgradeSuggestions,
} from './build.scoring'
import { color, font, radius, spacing } from '../../theme'

interface Props { build: BuildState }

const MAX_SCORE = 43000

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

export function BuildReport({ build }: Props) {
  const [open, setOpen] = useState(false)

  const tier        = useMemo(() => getTier(build), [build])
  const score       = useMemo(() => computeBuildScore(build), [build])
  const categories  = useMemo(() => getCategoryScores(build), [build])
  const suggestions = useMemo(() => getUpgradeSuggestions(build), [build])

  const ready = !!tier
  const pct   = ready ? Math.min(100, Math.round((score / MAX_SCORE) * 100)) : 0

  return (
    <View style={s.wrap}>
      <TouchableOpacity style={s.toggle} onPress={() => setOpen(v => !v)} activeOpacity={0.8}>
        <Text style={s.toggleLabel}>Build Report</Text>
        <View style={s.toggleRight}>
          {ready && <Text style={[s.toggleTier, { color: tier.color }]}>{tier.name}</Text>}
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={color.textDim}
          />
        </View>
      </TouchableOpacity>

      {open && (
        <View style={s.body}>
          {!ready ? (
            <Text style={s.missingMsg}>
              Select a CPU, GPU, Motherboard, RAM, and Storage to generate your build report.
            </Text>
          ) : (
            <>
              <View style={s.overallRow}>
                <View>
                  <Text style={[s.tierName, { color: tier.color }]}>{tier.name}</Text>
                  <Text style={s.scoreLine}>{score.toLocaleString()} · {pct}%</Text>
                </View>
                <View style={s.overallBar}>
                  <View style={[s.overallFill, { width: `${pct}%` as `${number}%`, backgroundColor: tier.color }]} />
                </View>
              </View>
              <Text style={s.tierDesc}>{tier.desc}</Text>

              <View style={s.catGrid}>
                {categories.map(cat => (
                  <View key={cat.id} style={s.catCard}>
                    <View style={s.catHeader}>
                      <Text style={s.catLabel}>{cat.label}</Text>
                      <Text style={s.catPct}>{cat.score}%</Text>
                    </View>
                    <View style={s.catBar}>
                      <View style={[s.catFill, { width: `${cat.score}%` as `${number}%`, backgroundColor: cat.tierColor }]} />
                    </View>
                    <Text style={[s.catTier, { color: cat.tierColor }]}>{cat.tierName}</Text>
                  </View>
                ))}
              </View>

              {suggestions.length > 0 && (
                <View style={s.suggestWrap}>
                  {suggestions.map((text, i) => (
                    <View key={i} style={s.suggestRow}>
                      <View style={s.suggestDot} />
                      <Text style={s.suggestTxt}>{text}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  wrap: {
    marginHorizontal: spacing.section,
    marginBottom: 12,
    backgroundColor: color.bgElevated,
    borderWidth: 0.5,
    borderColor: color.borderSubtle,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 13,
    paddingHorizontal: spacing.page,
  },
  toggleLabel: {
    fontSize: font.size.base,
    fontWeight: font.weight.semibold,
    color: color.textPrimary,
  },
  toggleRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleTier: { fontSize: font.size.body, fontWeight: font.weight.semibold },
  body: { paddingHorizontal: spacing.page, paddingBottom: spacing.page },
  overallRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingBottom: 8 },
  tierName: { fontSize: 18, fontWeight: font.weight.bold, letterSpacing: -0.3 },
  scoreLine: { fontSize: font.size.md, color: color.textDim, marginTop: 1 },
  overallBar: {
    flex: 1, height: 5, backgroundColor: color.bgHover,
    borderRadius: 3, overflow: 'hidden',
  },
  overallFill: { height: '100%', borderRadius: 3 },
  tierDesc: {
    fontSize: font.size.md, color: color.textDim, lineHeight: 19,
    paddingBottom: 14, borderBottomWidth: 0.5, borderBottomColor: color.borderSubtle,
  },
  catGrid: { paddingTop: 14, gap: 14, paddingBottom: 14 },
  catCard: { gap: 5 },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  catLabel: { fontSize: font.size.body, fontWeight: font.weight.medium, color: color.textPrimary },
  catPct:   { fontSize: font.size.body, fontWeight: font.weight.semibold, color: color.textDim },
  catBar:   { height: 5, backgroundColor: color.bgHover, borderRadius: 3, overflow: 'hidden' },
  catFill:  { height: '100%', borderRadius: 3 },
  catTier:  { fontSize: font.size.sm, fontWeight: font.weight.semibold },
  suggestWrap: { borderTopWidth: 0.5, borderTopColor: color.borderSubtle, paddingTop: 12 },
  suggestRow:  { flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'flex-start' },
  suggestDot:  { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', marginTop: 5 },
  suggestTxt:  { flex: 1, fontSize: font.size.md, color: color.textDim, lineHeight: 18 },
  missingMsg: {
    fontSize: font.size.body, color: color.textDim, lineHeight: 20,
    textAlign: 'center', paddingBottom: 4,
  },
  barRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  barLabel: { fontSize: font.size.sm, color: color.textSecondary, width: 80 },
  barTrack: { flex: 1, height: 5, backgroundColor: color.bgInput, borderRadius: 3, overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: 3 },
  barPct:   { fontSize: font.size.sm, color: color.textSecondary, width: 40, textAlign: 'right' },
})
