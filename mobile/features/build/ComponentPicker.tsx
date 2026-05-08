import {
  Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { CatalogOption, CatalogSlot } from './build.types'
import { color, font, radius, spacing } from '../../theme'

interface Props {
  slot: CatalogSlot
  selected: CatalogOption | undefined
  onSelect: (option: CatalogOption) => void
  onClose: () => void
  onClear: () => void
}

export function ComponentPicker({ slot, selected, onSelect, onClose, onClear }: Props) {
  let maxPtp = 0
  for (const o of slot.opts) {
    if (o.pm) {
      const ptp = Math.round(o.pm / o.p)
      if (ptp > maxPtp) maxPtp = ptp
    }
  }

  const handleSelect = (opt: CatalogOption) => {
    if (selected?.n === opt.n) {
      onClear()
    } else {
      onSelect(opt)
    }
    onClose()
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

        <FlatList
          data={slot.opts}
          keyExtractor={o => o.n}
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
