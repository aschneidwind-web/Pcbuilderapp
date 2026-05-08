import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { CatalogOption, CatalogSlot, SlotKey } from './build.types'
import { color, font, radius, spacing } from '../../theme'

const SLOT_ICONS: Record<SlotKey, React.ComponentProps<typeof Ionicons>['name']> = {
  cpu:         'hardware-chip-outline',
  cooler:      'thermometer-outline',
  gpu:         'tv-outline',
  motherboard: 'grid-outline',
  ram:         'server-outline',
  storage:     'save-outline',
  psu:         'flash-outline',
  case:        'cube-outline',
}

interface Props {
  slotKey: SlotKey
  slot: CatalogSlot
  selected: CatalogOption | undefined
  onClick: () => void
}

export function ComponentRow({ slotKey, slot, selected, onClick }: Props) {
  return (
    <TouchableOpacity style={s.row} onPress={onClick} activeOpacity={0.7}>
      <View style={[s.icon, { backgroundColor: slot.ib }]}>
        <Ionicons name={SLOT_ICONS[slotKey]} size={20} color={slot.ic} />
      </View>

      <View style={s.info}>
        <Text style={selected ? s.label : s.labelDim}>{slot.label}</Text>
        {selected && (
          <Text style={s.partName} numberOfLines={1}>{selected.n}</Text>
        )}
      </View>

      <View style={s.right}>
        {selected && <Text style={s.price}>${selected.p}</Text>}
        <Ionicons name="chevron-forward" size={14} color={color.textDisabled} />
      </View>
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.section,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: color.borderFaint,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
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
    color: color.textSecondary,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: font.size.base,
    fontWeight: font.weight.semibold,
    color: color.textPrimary,
    letterSpacing: -0.3,
  },
})
