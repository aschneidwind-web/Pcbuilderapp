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
      <div style={s.scroll}>
        {/* Header row */}
        <div style={s.headerRow}>
          <button style={s.shareBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" width="14" height="14">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span style={s.shareTxt}>Share</span>
          </button>
          <div style={s.avatar}>A</div>
        </div>

        {/* Subtitle */}
        <div style={s.subtitle}>
          Total estimate · {componentCount} of {TOTAL_SLOTS}
        </div>

        {/* Price */}
        <div style={s.price}>
          ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        {/* Socket compatibility pill */}
        {socketCompatible === false && <div style={s.errPill}>Socket mismatch</div>}
        {socketCompatible === true  && <div style={s.okPill}>Compatible</div>}

        {/* PC Illustration */}
        <div style={s.illustrationWrap}>
          <BuildIllustration build={build} />
        </div>

        {/* Components section */}
        <div style={s.componentsSection}>
          <div style={s.sectionHeader}>
            <span style={s.sectionTitle}>Components</span>
            <span style={s.sectionCount}>{componentCount} selected</span>
          </div>

          {SLOT_KEYS.map(key => (
            <ComponentRow
              key={key}
              slotKey={key}
              slot={CATALOG[key]}
              selected={build[key]}
              onClick={() => setActivePicker(key)}
            />
          ))}

          {/* Save area */}
          <div style={s.saveArea}>
            <input
              style={s.nameInput}
              value={buildName}
              onChange={e => setBuildName(e.target.value)}
              placeholder="Build name"
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
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#0A0A0F',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
  },

  // Header
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px 0',
  },
  shareBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(255,255,255,0.06)',
    border: 'none',
    borderRadius: 20,
    padding: '7px 14px',
    cursor: 'pointer',
  },
  shareTxt: {
    fontSize: 13,
    fontWeight: 500,
    color: '#A78BFA',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #7B2FFF, #FF6B9D)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
  },

  // Price area
  subtitle: {
    fontSize: 13,
    color: '#6B6B80',
    padding: '20px 20px 4px',
  },
  price: {
    fontSize: 40,
    fontWeight: 700,
    color: '#FFFFFF',
    letterSpacing: '-1px',
    padding: '0 20px',
    lineHeight: 1.1,
  },
  errPill: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 600,
    color: '#FF453A',
    background: 'rgba(255,69,58,0.12)',
    borderRadius: 8,
    padding: '3px 10px',
    margin: '8px 20px 0',
  },
  okPill: {
    display: 'inline-block',
    fontSize: 11,
    fontWeight: 600,
    color: '#34C759',
    background: 'rgba(52,199,89,0.12)',
    borderRadius: 8,
    padding: '3px 10px',
    margin: '8px 20px 0',
  },

  // Illustration
  illustrationWrap: {
    padding: '20px 20px 16px',
  },

  // Components section
  componentsSection: {
    background: 'rgba(255,255,255,0.03)',
    borderTop: '0.5px solid rgba(255,255,255,0.06)',
    borderRadius: '24px 24px 0 0',
    paddingBottom: 20,
    minHeight: 200,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 20px 6px',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  sectionCount: {
    fontSize: 13,
    color: '#6B6B80',
  },

  // Save area
  saveArea: {
    padding: '16px 20px 8px',
  },
  nameInput: {
    width: '100%',
    boxSizing: 'border-box' as const,
    background: 'rgba(255,255,255,0.04)',
    border: '0.5px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '11px 14px',
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
    outline: 'none',
    fontFamily: 'inherit',
  },
  saveBtn: {
    width: '100%',
    padding: 14,
    borderRadius: 14,
    border: 'none',
    background: '#7B2FFF',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontFamily: 'inherit',
  },
  saveBtnOff: {
    background: 'rgba(255,255,255,0.06)',
    color: '#4A4A5A',
    cursor: 'default',
  },
  saveBtnOk: {
    background: '#10B981',
  },
}
