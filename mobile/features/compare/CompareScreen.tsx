import { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native'
import { CATALOG } from '../build/build.catalog'
import { SLOT_KEYS } from '../build/build.types'
import type { SlotKey } from '../build/build.types'
import type { SortMode } from './compare.types'
import { toComparable, sortByMode, sortByPrice } from './compare.utils'
import { CompareCard } from './CompareCard'
import { color, font, radius, spacing } from '../../theme'

const SORT_MODES: { id: SortMode; label: string }[] = [
  { id: 'value', label: 'Best value' },
  { id: 'perf',  label: 'Performance' },
  { id: 'price', label: 'Price' },
]

export function CompareScreen() {
  const [slot, setSlot] = useState<SlotKey>('cpu')
  const [sort, setSort] = useState<SortMode>('value')

  const cat   = CATALOG[slot]
  const hasPM = cat.hasPM

  const cards = hasPM
    ? (() => {
        const items  = cat.opts.map(toComparable)
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
    <SafeAreaView style={s.root}>
      <View style={s.navbar}>
        <Text style={s.navTitle}>Compare</Text>
        <Text style={s.navSub}>{cat.label}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.slotScroll}
        contentContainerStyle={s.slotRow}
      >
        {SLOT_KEYS.map(key => (
          <TouchableOpacity
            key={key}
            style={[s.slotPill, slot === key && s.slotPillOn]}
            onPress={() => setSlot(key)}
          >
            <Text style={[s.slotPillTxt, slot === key && s.slotPillTxtOn]}>
              {CATALOG[key].label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {hasPM && (
        <View style={s.sortRow}>
          {SORT_MODES.map(({ id, label }) => (
            <TouchableOpacity
              key={id}
              style={[s.sortBtn, sort === id && s.sortBtnOn]}
              onPress={() => setSort(id)}
            >
              <Text style={[s.sortBtnTxt, sort === id && s.sortBtnTxtOn]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView style={s.list} contentContainerStyle={{ padding: spacing.page }}>
        {cards}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: color.bgApp },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.page,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: color.borderSubtle,
  },
  navTitle: { fontSize: font.size.xxl, fontWeight: font.weight.semibold, color: color.textPrimary },
  navSub:   { fontSize: font.size.body, color: color.textTertiary },
  slotScroll: { flexGrow: 0, borderBottomWidth: 0.5, borderBottomColor: color.borderSubtle },
  slotRow: { paddingHorizontal: spacing.page, paddingVertical: 10, gap: 8 },
  slotPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: color.bgCard,
    borderWidth: 0.5,
    borderColor: color.border,
  },
  slotPillOn: { backgroundColor: 'rgba(10,132,255,0.15)', borderColor: color.info },
  slotPillTxt: { fontSize: font.size.body, color: color.textSecondary, fontWeight: font.weight.medium },
  slotPillTxtOn: { color: color.info },
  sortRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.page,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: color.borderSubtle,
  },
  sortBtn: {
    flex: 1, paddingVertical: 7,
    borderRadius: 9,
    borderWidth: 0.5,
    borderColor: color.border,
    alignItems: 'center',
  },
  sortBtnOn: { backgroundColor: 'rgba(10,132,255,0.15)', borderColor: color.info },
  sortBtnTxt: { fontSize: font.size.md, fontWeight: font.weight.medium, color: color.textSecondary },
  sortBtnTxtOn: { color: color.info },
  list: { flex: 1 },
})
