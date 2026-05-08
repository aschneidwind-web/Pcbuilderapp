import {
  View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView,
} from 'react-native'
import { useSaves } from './useSaves'
import { SaveCard } from './SaveCard'
import { useBuild } from '../build/BuildContext'
import type { SavedBuild } from './saves.types'
import { color, font, spacing } from '../../theme'

export function SavesScreen() {
  const { builds, loading, error, deleteSave } = useSaves()
  const { loadBuild } = useBuild()

  const handleLoad = (build: SavedBuild) => {
    loadBuild(build.components)
  }

  const handleDelete = (id: string) => {
    void deleteSave(id)
  }

  return (
    <SafeAreaView style={s.root}>
      <View style={s.navbar}>
        <Text style={s.navTitle}>Saves</Text>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color={color.primaryLight} />
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.error}>Couldn't load builds: {error}</Text>
        </View>
      ) : builds.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyTitle}>No saved builds yet</Text>
          <Text style={s.emptySub}>Build something and save it.</Text>
        </View>
      ) : (
        <FlatList
          data={builds}
          keyExtractor={b => b.id}
          renderItem={({ item }) => (
            <SaveCard build={item} onLoad={handleLoad} onDelete={handleDelete} />
          )}
          contentContainerStyle={s.list}
          ListHeaderComponent={
            <Text style={s.count}>{builds.length} build{builds.length !== 1 ? 's' : ''}</Text>
          }
        />
      )}
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bgApp },
  navbar: { paddingHorizontal: spacing.page, paddingVertical: 12 },
  navTitle: { fontSize: font.size.xxl, fontWeight: font.weight.semibold, color: color.textPrimary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: color.error, fontSize: font.size.base, textAlign: 'center', padding: 32 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { color: color.textPrimary, fontSize: font.size.xl, fontWeight: font.weight.medium, marginBottom: 6 },
  emptySub: { color: color.textTertiary, fontSize: font.size.body },
  list: { padding: spacing.page },
  count: { color: color.textSecondary, fontSize: font.size.body, marginBottom: 12 },
})
