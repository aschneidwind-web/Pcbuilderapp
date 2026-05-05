import { useState } from 'react'
import { useBuild } from './BuildContext'
import { useSaves } from '../saves'
import { ComponentRow } from './ComponentRow'
import { ComponentPicker } from './ComponentPicker'
import { CATALOG } from './build.catalog'
import { SLOT_KEYS } from './build.types'
import type { SlotKey } from './build.types'
import type { BuildComponents } from '../saves'

const toBuildComponents = (build: ReturnType<typeof useBuild>['build']): BuildComponents => {
  const result: BuildComponents = {}
  for (const slot of SLOT_KEYS) {
    const opt = build[slot]
    if (opt) result[slot] = { name: opt.n, price: opt.p, spec: opt.s }
  }
  return result
}

export function BuildPage() {
  const { build, totalPrice, componentCount, socketCompatible, selectComponent } = useBuild()
  const { createSave } = useSaves()

  const [activePicker, setActivePicker] = useState<SlotKey | null>(null)
  const [buildName, setBuildName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  const handleSave = async () => {
    if (componentCount === 0) return
    setSaving(true)
    try {
      const name = buildName.trim() || `My build ${new Date().toLocaleDateString()}`
      await createSave({ name, components: toBuildComponents(build) })
      setSaveMsg('Saved!')
      setBuildName('')
    } catch {
      setSaveMsg('Failed to save')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(null), 2000)
    }
  }

  const btnStyle: React.CSSProperties = {
    ...s.saveBtn,
    ...(componentCount === 0 ? s.saveBtnOff : {}),
    ...(saveMsg === 'Saved!' ? s.saveBtnOk : {}),
  }

  return (
    <div style={s.page}>
      <div style={s.navbar}>
        <div style={s.navLeft}>
          <img src="/logo.png" width="18" height="17" alt="" />
          <div style={s.navTitle}>Build</div>
        </div>
        <div style={s.navSub}>{componentCount} / 7</div>
      </div>

      <div style={s.scroll}>
        <div style={s.totalCard}>
          <div style={s.totalAmt}>${totalPrice.toLocaleString()}</div>
          {socketCompatible === false && <div style={s.errPill}>Socket mismatch</div>}
          {socketCompatible === true  && <div style={s.okPill}>Compatible</div>}
          <div style={s.progTrack}>
            <div style={{ ...s.progFill, width: `${Math.round((componentCount / 7) * 100)}%` }} />
          </div>
        </div>

        <div style={s.list}>
          {SLOT_KEYS.map(key => (
            <ComponentRow
              key={key}
              slot={CATALOG[key]}
              selected={build[key]}
              onClick={() => setActivePicker(key)}
            />
          ))}
        </div>

        <div style={s.saveArea}>
          <input
            style={s.nameInput}
            value={buildName}
            onChange={e => setBuildName(e.target.value)}
            placeholder="Build name (optional)"
          />
          <button style={btnStyle} onClick={handleSave} disabled={saving || componentCount === 0}>
            {saveMsg ?? (saving ? 'Saving…' : 'Save build')}
          </button>
        </div>
      </div>

      {activePicker && (
        <ComponentPicker
          slot={CATALOG[activePicker]}
          selected={build[activePicker]}
          onSelect={opt => selectComponent(activePicker, opt)}
          onClose={() => setActivePicker(null)}
        />
      )}
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    height: '100%', display: 'flex', flexDirection: 'column',
    background: '#0b0b0e', position: 'relative', overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  navbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 16px 12px',
    borderBottom: '0.5px solid rgba(255,255,255,0.08)',
    flexShrink: 0,
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  navTitle: { fontSize: 17, fontWeight: 600, color: '#fff' },
  navSub:   { fontSize: 13, color: '#8E8E93' },
  scroll:   { flex: 1, overflowY: 'auto', padding: '0 16px' },
  totalCard: {
    background: '#1c1c1e', borderRadius: 14,
    padding: '14px 16px', margin: '14px 0',
  },
  totalAmt: { fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 },
  errPill: {
    display: 'inline-block', fontSize: 11, fontWeight: 600,
    color: '#FF453A', background: 'rgba(255,69,58,0.15)',
    borderRadius: 8, padding: '3px 8px', marginBottom: 8,
  },
  okPill: {
    display: 'inline-block', fontSize: 11, fontWeight: 600,
    color: '#34C759', background: 'rgba(52,199,89,0.15)',
    borderRadius: 8, padding: '3px 8px', marginBottom: 8,
  },
  progTrack: { height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 },
  progFill:  { height: '100%', background: '#0A84FF', borderRadius: 2, transition: 'width 0.3s ease' },
  list:      { paddingBottom: 8 },
  saveArea:  { paddingBottom: 24, paddingTop: 8 },
  nameInput: {
    width: '100%', boxSizing: 'border-box',
    background: '#1c1c1e', border: '0.5px solid rgba(255,255,255,0.1)',
    borderRadius: 10, padding: '10px 12px',
    color: '#fff', fontSize: 14, marginBottom: 10, outline: 'none',
  },
  saveBtn: {
    width: '100%', padding: 13, borderRadius: 12, border: 'none',
    background: '#0A84FF', color: '#fff', fontSize: 15, fontWeight: 600,
    cursor: 'pointer', transition: 'background 0.2s',
  },
  saveBtnOff: { background: '#2c2c2e', color: '#636366', cursor: 'default' },
  saveBtnOk:  { background: '#34C759' },
}
