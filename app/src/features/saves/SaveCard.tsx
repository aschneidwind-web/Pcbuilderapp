import type { SavedBuild } from './saves.types'
import { color, radius, font } from '../../theme'

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
    background: color.bgCard, border: color.border,
    borderRadius: radius.lg, padding: 14, marginBottom: 10,
  },
  name: { color: color.textPrimary, fontSize: font.size.lg, fontWeight: font.weight.medium, marginBottom: 4 },
  meta: { color: color.textSecondary, fontSize: font.size.md, marginBottom: 8 },
  parts: { color: color.textTertiary, fontSize: font.size.md, marginBottom: 12, lineHeight: 1.4 },
  actions: { display: 'flex', gap: 8 },
  load: {
    flex: 1, padding: '8px 12px', borderRadius: radius.sm, border: 'none',
    background: color.primary, color: color.textPrimary, fontSize: font.size.body, fontWeight: font.weight.medium,
    cursor: 'pointer',
  },
  delete: {
    padding: '8px 12px', borderRadius: radius.sm, border: '0.5px solid rgba(255,69,58,0.4)',
    background: 'transparent', color: color.error, fontSize: font.size.body, fontWeight: font.weight.medium,
    cursor: 'pointer',
  },
}
