import { useState } from 'react'
import { SlideBase } from './SlideBase'
import { updatePassword } from './account.api'

interface Props { onClose: () => void }

export function ChangePasswordSlide({ onClose }: Props) {
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [conf, setConf]       = useState('')
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [saved, setSaved]     = useState(false)

  const handleUpdate = async () => {
    if (!oldPass)        { setError('Enter your current password'); return }
    if (newPass.length < 6) { setError('New password must be at least 6 characters'); return }
    if (newPass !== conf)   { setError('Passwords do not match'); return }
    setSaving(true)
    setError(null)
    try {
      await updatePassword(oldPass, newPass)
      setSaved(true)
      setTimeout(() => { setOldPass(''); setNewPass(''); setConf(''); onClose() }, 900)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SlideBase title="Change password" onClose={onClose}>
      <div style={s.card}>
        <Field label="Current password" value={oldPass} onChange={setOldPass} placeholder="Current password" />
        <Field label="New password"     value={newPass} onChange={setNewPass} placeholder="Min. 6 characters" />
        <Field label="Confirm new password" value={conf} onChange={setConf} placeholder="Repeat new password" last />
        <button style={{ ...s.btn, opacity: saving ? 0.7 : 1 }} onClick={handleUpdate} disabled={saving}>
          {saving ? 'Updating…' : 'Update password'}
        </button>
        {error && <div style={s.error}>{error}</div>}
        {saved && <div style={s.success}>Password updated!</div>}
      </div>
    </SlideBase>
  )
}

function Field({ label, value, onChange, placeholder, last }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; last?: boolean
}) {
  return (
    <div style={{ marginBottom: last ? 0 : 14 }}>
      <label style={s.label}>{label}</label>
      <input style={s.input} type="password" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  card: {
    background: '#1c1c1e', borderRadius: 14,
    border: '0.5px solid rgba(255,255,255,0.12)', padding: 16,
  },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#AEAEB2', marginBottom: 6 },
  input: {
    width: '100%', boxSizing: 'border-box',
    background: '#2c2c2e', border: '0.5px solid rgba(255,255,255,0.1)',
    borderRadius: 10, padding: '11px 12px',
    color: '#fff', fontSize: 15, outline: 'none',
  },
  btn: {
    width: '100%', padding: 12, borderRadius: 10, border: 'none',
    background: '#0A84FF', color: '#fff', fontSize: 14, fontWeight: 500,
    cursor: 'pointer', marginTop: 16,
  },
  error:   { fontSize: 12, color: '#FF453A', textAlign: 'center', marginTop: 8 },
  success: { fontSize: 12, color: '#30d158', textAlign: 'center', marginTop: 8 },
}
