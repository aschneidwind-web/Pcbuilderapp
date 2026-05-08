import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import type { SavedBuild } from './saves.types'
import { color, font, radius, spacing } from '../../theme'

interface Props {
  build: SavedBuild
  onLoad: (build: SavedBuild) => void
  onDelete: (id: string) => void
}

const formatComponents = (build: SavedBuild): string => {
  const parts = Object.values(build.components)
    .filter(Boolean)
    .map(c => c!.name.split(' ').slice(0, 2).join(' '))
  return parts.length ? parts.join(' · ') : 'No components'
}

const formatDate = (iso: string): string => new Date(iso).toLocaleDateString()

export function SaveCard({ build, onLoad, onDelete }: Props) {
  return (
    <View style={s.card}>
      <Text style={s.name}>{build.name}</Text>
      <Text style={s.meta}>
        ${build.totalPrice.toLocaleString()} · {formatDate(build.createdAt)}
      </Text>
      <Text style={s.parts} numberOfLines={2}>{formatComponents(build)}</Text>
      <View style={s.actions}>
        <TouchableOpacity style={s.loadBtn} onPress={() => onLoad(build)} activeOpacity={0.8}>
          <Text style={s.loadTxt}>Load build</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.deleteBtn} onPress={() => onDelete(build.id)} activeOpacity={0.8}>
          <Text style={s.deleteTxt}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  card: {
    backgroundColor: color.bgCard,
    borderWidth: 0.5,
    borderColor: color.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
  },
  name: {
    color: color.textPrimary,
    fontSize: font.size.lg,
    fontWeight: font.weight.medium,
    marginBottom: 4,
  },
  meta: { color: color.textSecondary, fontSize: font.size.md, marginBottom: 8 },
  parts: { color: color.textTertiary, fontSize: font.size.md, marginBottom: 12, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 8 },
  loadBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    backgroundColor: color.primary,
    alignItems: 'center',
  },
  loadTxt: { color: color.textPrimary, fontSize: font.size.body, fontWeight: font.weight.medium },
  deleteBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    borderWidth: 0.5,
    borderColor: 'rgba(255,69,58,0.4)',
    alignItems: 'center',
  },
  deleteTxt: { color: color.error, fontSize: font.size.body, fontWeight: font.weight.medium },
})
