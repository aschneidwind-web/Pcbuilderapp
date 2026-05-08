import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { color, font, radius, spacing } from '../../theme'

interface RowProps {
  iconBg: string
  iconColor: string
  iconName: React.ComponentProps<typeof Ionicons>['name']
  label: string
  value?: string
  onPress?: () => void
  danger?: boolean
  right?: React.ReactNode
}

export function SettingsRow({ iconBg, iconColor, iconName, label, value, onPress, danger, right }: RowProps) {
  return (
    <TouchableOpacity style={s.row} onPress={onPress} disabled={!onPress && !right} activeOpacity={0.7}>
      <View style={s.left}>
        <View style={[s.ico, { backgroundColor: iconBg }]}>
          <Ionicons name={iconName} size={16} color={iconColor} />
        </View>
        <Text style={danger ? s.dangerLabel : s.label}>{label}</Text>
      </View>
      <View style={s.rightWrap}>
        {value ? <Text style={s.value}>{value}</Text> : null}
        {right ?? (onPress ? <Text style={s.arrow}>›</Text> : null)}
      </View>
    </TouchableOpacity>
  )
}

interface GroupProps { children: React.ReactNode; style?: object }

export function SettingsGroup({ children, style }: GroupProps) {
  return (
    <View style={[s.group, style]}>
      {children}
    </View>
  )
}

interface ToggleProps { on: boolean; onToggle: () => void }

export function Toggle({ on, onToggle }: ToggleProps) {
  return (
    <Switch
      value={on}
      onValueChange={onToggle}
      trackColor={{ false: 'rgba(255,255,255,0.18)', true: color.success }}
      thumbColor={color.textPrimary}
    />
  )
}

const s = StyleSheet.create({
  group: {
    backgroundColor: color.bgCard,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: color.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.page,
    paddingVertical: 13,
    borderBottomWidth: 0.5,
    borderBottomColor: color.borderSubtle,
  },
  left:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ico:   {
    width: 30, height: 30, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  label:       { fontSize: font.size.base, color: color.textPrimary },
  dangerLabel: { fontSize: font.size.base, color: color.error },
  rightWrap:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  value:       { fontSize: font.size.body, color: color.textTertiary },
  arrow:       { fontSize: 18, color: color.textTertiary },
})
