import { useSaves } from './useSaves'
import { SaveCard } from './SaveCard'
import type { SavedBuild } from './saves.types'

interface Props {
  onLoad?: (build: SavedBuild) => void
}

export function SavesPage({ onLoad }: Props) {
  const { builds, loading, error, deleteSave } = useSaves()

  if (loading) return <div style={styles.state}>Loading…</div>
  if (error) return <div style={styles.error}>Couldn't load builds: {error}</div>

  if (builds.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyTitle}>No saved builds yet</div>
        <div style={styles.emptySub}>Build something and save it.</div>
      </div>
    )
  }

  const handleDelete = (id: string) => {
    void deleteSave(id).catch(() => {
      // TODO: surface via toast once notification system is migrated out of iframe
    })
  }

  return (
    <div style={styles.list}>
      <div style={styles.count}>
        {builds.length} build{builds.length !== 1 ? 's' : ''}
      </div>
      {builds.map(b => (
        <SaveCard
          key={b.id}
          build={b}
          onLoad={onLoad ?? (() => {})}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  list: { padding: 16 },
  count: { color: '#AEAEB2', fontSize: 13, marginBottom: 12 },
  state: { color: '#AEAEB2', textAlign: 'center', padding: 32 },
  error: { color: '#FF453A', textAlign: 'center', padding: 32, fontSize: 14 },
  empty: { textAlign: 'center', padding: '64px 32px' },
  emptyTitle: { color: '#fff', fontSize: 16, fontWeight: 500, marginBottom: 6 },
  emptySub: { color: '#8E8E93', fontSize: 13 },
}
