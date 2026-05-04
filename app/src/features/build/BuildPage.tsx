import { useState } from 'react'
import { useBuild } from './BuildContext'
import { useSaves } from '../saves'
import { ComponentRow } from './ComponentRow'
import { ComponentPicker } from './ComponentPicker'
import { BuildIllustration } from './BuildIllustration'
import { CATALOG } from './build.catalog'
import { SLOT_KEYS } from './build.types'
import type { SlotKey } from './build.types'
import type { BuildComponents } from '../saves'

const TOTAL_SLOTS = SLOT_KEYS.length

const toBuildComponents = (build: ReturnType<typeof useBuild>['build']): BuildComponents => {
  const result: BuildComponents = {}
  for (const slot of SLOT_KEYS) {
    const opt = build[slot]
    if (opt) result[slot] = { name: opt.n, price: opt.p, spec: opt.s }
  }
  return result
}

// Gradient colors per slot for the new design
const SLOT_GRADIENTS: Record<SlotKey, [string, string]> = {
  cpu:         ['#7B2FFF', '#A855F7'],
  cooler:      ['#10B981', '#34D399'],
  gpu:         ['#FF6B9D', '#FF8FAD'],
  motherboard: ['#6366F1', '#818CF8'],
  ram:         ['#F59E0B', '#FBBF24'],
  storage:     ['#06B6D4', '#22D3EE'],
  psu:         ['#EF4444', '#F87171'],
  case:        ['#8B5CF6', '#A78BFA'],
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

  const priceFormatted = '$' + totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })

  const btnStyle: React.CSSProperties = {
    ...s.saveBtn,
    ...(componentCount === 0 ? s.saveBtnOff : {}),
    ...(saveMsg === 'Saved!' ? s.saveBtnOk : {}),
  }

  // First letter of first selected component name, or default
  const avatarLetter = build.cpu?.n?.[0] ?? build.gpu?.n?.[0] ?? 'P'

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <button style={s.shareBtn}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          <span style={s.shareTxt}>Share</span>
        </button>
        <div style={s.avatar}>{avatarLetter}</div>
      </div>

      {/* Price hero */}
      <div style={s.heroSection}>
        <div style={s.heroSub}>
          Total estimate · {componentCount} of {TOTAL_SLOTS}
          {socketCompatible === false && <span style={s.mismatchBadge}> · Socket mismatch</span>}
          {socketCompatible === true  && <span style={s.compatBadge}> · Compatible</span>}
        </div>
        <div style={s.heroPrice}>{priceFormatted}</div>
      </div>

      {/* PC Illustration */}
      <BuildIllustration build={build} />

      {/* Components panel */}
      <div style={s.panel}>
        <div style={s.scroll}>
          <div style={s.panelHeader}>
            <span style={s.panelTitle}>Components</span>
            <span style={s.panelCount}>{componentCount} selected</span>
          </div>

          {SLOT_KEYS.map(key => {
            const slot = CATALOG[key]
            const selected = build[key]
            const [g1, g2] = SLOT_GRADIENTS[key]
            const gradientId = `grad-${key}`
            return (
              <div key={key} style={{ ...s.compCard, ...(selected ? s.compCardSel : {}) }} onClick={() => setActivePicker(key)}>
                <div style={s.compIconWrap}>
                  {selected ? (
                    <svg width={0} height={0} style={{ position: 'absolute' }}>
                      <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={g1} />
                          <stop offset="100%" stopColor={g2} />
                        </linearGradient>
                      </defs>
                    </svg>
                  ) : null}
                  <div
                    style={{
                      ...s.compIcon,
                      background: selected
                        ? `linear-gradient(135deg, ${g1}, ${g2})`
                        : 'rgba(255,255,255,0.06)',
                    }}
                    dangerouslySetInnerHTML={{ __html: slot.icon }}
                  />
                </div>
                <div style={s.compInfo}>
                  <div style={s.compLabel}>{slot.label}</div>
                  {selected
                    ? <div style={{ ...s.compName, color: g2 }}>{selected.n}</div>
                    : <div style={s.compEmpty}>Choose {slot.label}</div>
                  }
                </div>
                <div style={s.compRight}>
                  {selected && <span style={s.compPrice}>${selected.p}</span>}
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#4A4A5A" strokeWidth={2} strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </div>
            )
          })}

          {/* Save area */}
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
    background: '#0A0A0F', position: 'relative', overflow: 'hidden',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px 8px', flexShrink: 0,
  },
  shareBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'rgba(255,255,255,0.06)', border: 'none',
    borderRadius: 20, padding: '6px 12px', cursor: 'pointer',
  },
  shareTxt: { fontSize: 13, fontWeight: 500, color: '#A78BFA' },
  avatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'linear-gradient(135deg, #7B2FFF, #FF6B9D)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, color: '#fff',
  },
  heroSection: { padding: '4px 16px 10px', flexShrink: 0 },
  heroSub: { fontSize: 13, color: '#6B6B80', marginBottom: 4 },
  heroPrice: {
    fontSize: 40, fontWeight: 700, color: '#FFFFFF',
    letterSpacing: -1, lineHeight: 1.1,
  },
  mismatchBadge: { color: '#F87171', fontSize: 12 },
  compatBadge:   { color: '#34D399', fontSize: 12 },
  panel: {
    flex: 1, overflow: 'hidden',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '24px 24px 0 0',
    borderTop: '0.5px solid rgba(255,255,255,0.06)',
    marginTop: 10,
  },
  scroll: { height: '100%', overflowY: 'auto', padding: '0 14px' },
  panelHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 2px 10px', flexShrink: 0,
  },
  panelTitle: { fontSize: 15, fontWeight: 600, color: '#FFFFFF' },
  panelCount: { fontSize: 13, color: '#6B6B80' },
  compCard: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 12px', borderRadius: 14, marginBottom: 6,
    background: 'rgba(255,255,255,0.04)',
    border: '0.5px solid rgba(255,255,255,0.06)',
    cursor: 'pointer',
  },
  compCardSel: {
    border: '0.5px solid rgba(255,255,255,0.08)',
  },
  compIconWrap: { position: 'relative', flexShrink: 0 },
  compIcon: {
    width: 40, height: 40, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff',
  },
  compInfo: { flex: 1, minWidth: 0 },
  compLabel: { fontSize: 11, color: '#6B6B80', marginBottom: 2 },
  compName:  { fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  compEmpty: { fontSize: 13, color: '#4A4A5A' },
  compRight: { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 },
  compPrice: { fontSize: 13, fontWeight: 600, color: '#FFFFFF' },
  saveArea:  { paddingTop: 8, paddingBottom: 24 },
  nameInput: {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)',
    border: '0.5px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: '11px 14px',
    color: '#fff', fontSize: 14, marginBottom: 10, outline: 'none',
  },
  saveBtn: {
    width: '100%', padding: 13, borderRadius: 12, border: 'none',
    background: '#7B2FFF', color: '#fff', fontSize: 15, fontWeight: 600,
    cursor: 'pointer',
  },
  saveBtnOff: { background: 'rgba(255,255,255,0.06)', color: '#4A4A5A', cursor: 'default' },
  saveBtnOk:  { background: '#10B981' },
}
