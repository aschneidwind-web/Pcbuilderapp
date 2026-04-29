import type { SavedBuild } from './saves.types'

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

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString()

export function SaveCard({ build, onLoad, onDelete }: Props) {
  return (
    <div style={styles.card}>
      <div style={styles.name}>{build.name}</div>
      <div style={styles.meta}>
        ${build.totalPrice.toLocaleString()} · {formatDate(build.createdAt)}
      </div>
      <div style={styles.parts}>{formatComponents(build)}</div>
      <div style={styles.actions}>
        <button style={styles.load} onClick={() => onLoad(build)}>
          Load build
        </button>
        <button style={styles.delete} onClick={() => onDelete(build.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#1c1c1e', border: '0.5px solid rgba(255,255,255,0.1)',
    borderRadius: 14, padding: 14, marginBottom: 10,
  },
  name: { color: '#fff', fontSize: 15, fontWeight: 500, marginBottom: 4 },
  meta: { color: '#AEAEB2', fontSize: 12, marginBottom: 8 },
  parts: { color: '#8E8E93', fontSize: 12, marginBottom: 12, lineHeight: 1.4 },
  actions: { display: 'flex', gap: 8 },
  load: {
    flex: 1, padding: '8px 12px', borderRadius: 8, border: 'none',
    background: '#0A84FF', color: '#fff', fontSize: 13, fontWeight: 500,
    cursor: 'pointer',
  },
  delete: {
    padding: '8px 12px', borderRadius: 8, border: '0.5px solid rgba(255,69,58,0.4)',
    background: 'transparent', color: '#FF453A', fontSize: 13, fontWeight: 500,
    cursor: 'pointer',
  },
}
