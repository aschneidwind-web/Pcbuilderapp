import { useMemo, useState } from 'react'
import {
  Modal, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import type { CatalogOption, CatalogSlot } from './build.types'
import { color, font, radius, spacing } from '../../theme'

type SortMode = 'popular' | 'price_asc' | 'price_desc' | 'performance'

interface Props {
  slot: CatalogSlot
  selected: CatalogOption | undefined
  onSelect: (option: CatalogOption) => void
  onClose: () => void
  onClear: () => void
}

function sortOptions(opts: CatalogOption[], mode: SortMode): CatalogOption[] {
  const next = [...opts]
  if (mode === 'price_asc')   return next.sort((a, b) => a.p - b.p)
  if (mode === 'price_desc')  return next.sort((a, b) => b.p - a.p)
  if (mode === 'performance') return next.sort((a, b) => (b.pm ?? 0) - (a.pm ?? 0))
  // popular: samples desc, parts without samples fall to the bottom in catalog order
  return next.sort((a, b) => (b.samples ?? -1) - (a.samples ?? -1))
}

function filterOptions(opts: CatalogOption[], query: string): CatalogOption[] {
  const q = query.trim().toLowerCase()
  if (!q) return opts
  return opts.filter(o => o.n.toLowerCase().includes(q) || o.s.toLowerCase().includes(q))
}

export function ComponentPicker({ slot, selected, onSelect, onClose, onClear }: Props) {
  const [sortMode, setSortMode] = useState<SortMode>('popular')
  const [query, setQuery]       = useState('')

  const isPriceActive = sortMode === 'price_asc' || sortMode === 'price_desc'
  const priceLabel    = sortMode === 'price_asc' ? 'Price ↑' : sortMode === 'price_desc' ? 'Price ↓' : 'Price'

  const { visibleOpts, maxPtp } = useMemo(() => {
    const filtered = filterOptions(slot.opts, query)
    const sorted   = sortOptions(filtered, sortMode)
    let max = 0
    for (const o of sorted) {
      if (!o.pm) continue
      const ptp = Math.round(o.pm / o.p)
      if (ptp > max) max = ptp
    }
    return { visibleOpts: sorted, maxPtp: max }
  }, [slot.opts, sortMode, query])

  const handleSelect = (opt: CatalogOption) => {
    if (selected?.n === opt.n) {
      onClear()
    } else {
      onSelect(opt)
    }
    onClose()
  }

  const handlePriceChip = () => {
    setSortMode(isPriceActive ? (sortMode === 'price_asc' ? 'price_desc' : 'price_asc') : 'price_asc')
  }

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={s.root}>
        <View style={s.header}>
          <TouchableOpacity onPress={onClose} style={s.backBtn}>
            <Ionicons name="chevron-back" size={20} color={color.primaryLight} />
          </TouchableOpacity>
          <Text style={s.title}>{slot.label}</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={s.searchWrap}>
          <Ionicons name="search" size={16} color={color.textDim} style={s.searchIcon} />
          <TextInput
            style={s.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={`Search ${slot.label.toLowerCase()}…`}
            placeholderTextColor={color.textDim}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={s.clearBtn} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={color.textDim} />
            </TouchableOpacity>
          )}
        </View>

        <View style={s.sortBar}>
          <TouchableOpacity
            style={[s.sortChip, sortMode === 'popular' && s.sortChipActive]}
            onPress={() => setSortMode('popular')}
            activeOpacity={0.7}
          >
            <Text style={[s.sortChipText, sortMode === 'popular' && s.sortChipTextActive]}>
              Popular
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.sortChip, isPriceActive && s.sortChipActive]}
            onPress={handlePriceChip}
            activeOpacity={0.7}
          >
            <Text style={[s.sortChipText, isPriceActive && s.sortChipTextActive]}>
              {priceLabel}
            </Text>
          </TouchableOpacity>

          {slot.hasPM && (
            <TouchableOpacity
              style={[s.sortChip, sortMode === 'performance' && s.sortChipActive]}
              onPress={() => setSortMode('performance')}
              activeOpacity={0.7}
            >
              <Text style={[s.sortChipText, sortMode === 'performance' && s.sortChipTextActive]}>
                Performance
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={visibleOpts}
          keyExtractor={o => o.n}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyText}>No matches for "{query}"</Text>
            </View>
          }
          renderItem={({ item: opt }) => {
            const ptp = opt.pm ? Math.round(opt.pm / opt.p) : null
            const isBestValue = ptp != null && ptp === maxPtp
            const isSel = selected?.n === opt.n

            return (
              <TouchableOpacity
                style={[s.optRow, isSel && s.optRowSel]}
                onPress={() => handleSelect(opt)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <View style={s.nameRow}>
                    <Text style={s.optName}>{opt.n}</Text>
                    {isBestValue && <Text style={s.badge}>best value</Text>}
                  </View>
                  <Text style={s.optSpec}>{opt.s}</Text>
                </View>

                <View style={s.optRight}>
                  <Text style={s.optPrice}>${opt.p}</Text>
                  {ptp ? <Text style={s.optPts}>{ptp} pts/$</Text> : null}
                </View>

                {isSel && (
                  <View style={s.selIndicator}>
                    <Ionicons name="checkmark" size={16} color={color.primaryLight} />
                    <Text style={s.tapRemove}>tap to remove</Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          }}
          contentContainerStyle={{ paddingHorizontal: spacing.page }}
        />
      </SafeAreaView>
    </Modal>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bgApp },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.page,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: color.borderSubtle,
  },
  backBtn: { padding: 4 },
  title: {
    fontSize: font.size.xxl,
    fontWeight: font.weight.semibold,
    color: color.textPrimary,
  },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.page,
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 10,
    backgroundColor: color.bgHover,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: color.borderSubtle,
  },
  searchIcon: { marginRight: 6 },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: font.size.body,
    color: color.textPrimary,
  },
  clearBtn: { padding: 4 },

  sortBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.page,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: color.borderFaint,
  },
  sortChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    backgroundColor: 'transparent',
  },
  sortChipActive: {
    borderColor: color.primary,
    backgroundColor: `${color.primary}18`,
  },
  sortChipText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    color: color.textDim,
  },
  sortChipTextActive: {
    color: color.primaryLight,
  },

  empty: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: font.size.body, color: color.textDim },

  optRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: color.borderFaint,
  },
  optRowSel: {
    backgroundColor: color.bgHover,
    marginHorizontal: -spacing.page,
    paddingHorizontal: spacing.page,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  optName: {
    fontSize: font.size.body,
    fontWeight: font.weight.medium,
    color: color.textPrimary,
    flexShrink: 1,
  },
  badge: {
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    color: color.success,
    backgroundColor: color.successBg,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  optSpec: { fontSize: font.size.md, color: color.textDim },
  optRight: { alignItems: 'flex-end', gap: 2 },
  optPrice: {
    fontSize: font.size.body,
    fontWeight: font.weight.semibold,
    color: color.textPrimary,
  },
  optPts: { fontSize: font.size.sm, color: color.textDim },
  selIndicator: { alignItems: 'center', gap: 2 },
  tapRemove: { fontSize: font.size.xs, color: color.textDim },
})
