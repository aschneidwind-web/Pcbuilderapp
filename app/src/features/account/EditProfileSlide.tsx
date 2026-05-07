import { useState } from 'react'
import { SlideBase } from './SlideBase'
import { AVATAR_COLS } from './account.types'
import { color, radius, font } from '../../theme'
import type { Profile, UpdateProfileInput } from './account.types'

interface Props {
  profile: Profile | null
  onSave: (input: UpdateProfileInput) => Promise<Profile>
  onClose: () => void
}

export function EditProfileSlide({ profile, onSave, onClose }: Props) {
  const [username, setUsername] = useState(profile?.username ?? '')
  const [bio, setBio]           = useState(profile?.bio ?? '')
  const [avatarIdx, setAvatarIdx] = useState(profile?.avatarIdx ?? 0)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [saved, setSaved]       = useState(false)

  const handleSave = async () => {
    if (!username.trim()) { setError('Display name is required'); return }
    setSaving(true)
    setError(null)
    try {
      await onSave({ username: username.trim(), bio: bio.trim(), avatarIdx })
      setSaved(true)
      setTimeout(onClose, 700)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SlideBase title="Edit profile" onClose={onClose}>
      <div style={s.card}>
        <div style={s.cardTitle}>Display name</div>
        <input style={s.input} value={username} onChange={e => setUsername(e.target.value)} placeholder="Your name" type="text" />
        <div style={s.cardTitle}>Bio</div>
        <textarea style={{ ...s.input, resize: 'none', lineHeight: 1.5 }} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell the community about yourself…" rows={3} />
        <button style={{ ...s.btn, opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {error  && <div style={s.error}>{error}</div>}
        {saved  && <div style={s.success}>Saved!</div>}
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Avatar colour</div>
        <div style={s.colorRow}>
          {AVATAR_COLS.map((col, i) => (
            <button
              key={col}
              onClick={() => setAvatarIdx(i)}
              style={{
                width: 36, height: 36, borderRadius: '50%', background: col,
                border: avatarIdx === i ? `3px solid ${color.textPrimary}` : '3px solid transparent',
                cursor: 'pointer', flexShrink: 0, transition: 'border 0.15s',
              }}
            />
          ))}
        </div>
      </div>
    </SlideBase>
  )
}

const s: Record<string, React.CSSProperties> = {
  card: {
    background: color.bgCard, borderRadius: radius.lg,
    border: color.border,
    padding: 16, marginBottom: 12,
  },
  cardTitle: {
    fontSize: font.size.sm, fontWeight: font.weight.medium, color: color.textTertiary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
  },
  input: {
    width: '100%', boxSizing: 'border-box',
    background: color.bgInput, border: color.border,
    borderRadius: 10, padding: '11px 12px',
    color: color.textPrimary, fontSize: font.size.lg, outline: 'none', marginBottom: 14,
  },
  btn: {
    width: '100%', padding: 12, borderRadius: 10, border: 'none',
    background: color.info, color: color.textPrimary, fontSize: font.size.base, fontWeight: font.weight.medium,
    cursor: 'pointer', marginTop: 4,
  },
  error:   { fontSize: font.size.md, color: color.error, textAlign: 'center', marginTop: 8 },
  success: { fontSize: font.size.md, color: color.success, textAlign: 'center', marginTop: 8 },
  colorRow: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 },
}
