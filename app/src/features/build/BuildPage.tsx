import { useState } from 'react'
import { useBuild } from './BuildContext'
import { useSaves } from '../saves'
import { ComponentRow } from './ComponentRow'
import { ComponentPicker } from './ComponentPicker'
import { BuildIllustration } from './BuildIllustration'
import { BuildReport } from './BuildReport'
import { CATALOG } from './build.catalog'
import { SLOT_KEYS } from './build.types'
import type { SlotKey } from './build.types'
import type { BuildComponents } from '../saves'
import { color, radius, font } from '../../theme'

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
  const { build, totalPrice, componentCount, socketCompatible, selectComponent, clearComponent } = useBuild()
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
          {/* TODO: implement share flow */}
          <button style={s.shareBtn} onClick={() => {}}>
            <svg viewBox="0 0 24 24" fill="none" stroke={color.primaryLight} strokeWidth="2" strokeLinecap="round" width="14" height="14">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span style={s.shareTxt}>Share</span>
          </button>
          <img src="/logo.png" alt="PartFlow" style={s.logo} />
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

        {/* Build Report — appears once CPU or GPU is selected */}
        <BuildReport build={build} />

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
          onClear={() => clearComponent(activePicker)}
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
    background: color.bgApp,
    position: 'relative',
    overflow: 'hidden',
    fontFamily: font.family,
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
    background: color.bgHover,
    border: 'none',
    borderRadius: radius.pill,
    padding: '7px 14px',
    cursor: 'pointer',
  },
  shareTxt: {
    fontSize: font.size.body,
    fontWeight: font.weight.medium,
    color: color.primaryLight,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    background: color.gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: font.size.base,
    fontWeight: font.weight.semibold,
    color: color.textPrimary,
  },

  // Price area
  subtitle: {
    fontSize: font.size.body,
    color: color.textDim,
    padding: '20px 20px 4px',
  },
  price: {
    fontSize: font.size.hero,
    fontWeight: font.weight.bold,
    color: color.textPrimary,
    letterSpacing: '-1px',
    padding: '0 20px',
    lineHeight: 1.1,
  },
  errPill: {
    display: 'inline-block',
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: color.error,
    background: color.errorBg,
    borderRadius: radius.sm,
    padding: '3px 10px',
    margin: '8px 20px 0',
  },
  okPill: {
    display: 'inline-block',
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: color.success,
    background: color.successBg,
    borderRadius: radius.sm,
    padding: '3px 10px',
    margin: '8px 20px 0',
  },

  // Illustration
  illustrationWrap: {
    padding: '20px 20px 16px',
  },

  // Components section
  componentsSection: {
    background: color.bgElevated,
    borderTop: color.borderSubtle,
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
    fontSize: font.size.xl,
    fontWeight: font.weight.semibold,
    color: color.textPrimary,
  },
  sectionCount: {
    fontSize: font.size.body,
    color: color.textDim,
  },

  // Save area
  saveArea: {
    padding: '16px 20px 8px',
  },
  nameInput: {
    width: '100%',
    boxSizing: 'border-box' as const,
    background: color.bgElevated,
    border: color.borderSubtle,
    borderRadius: radius.md,
    padding: '11px 14px',
    color: color.textPrimary,
    fontSize: font.size.base,
    marginBottom: 10,
    outline: 'none',
    fontFamily: 'inherit',
  },
  saveBtn: {
    width: '100%',
    padding: 14,
    borderRadius: radius.lg,
    border: 'none',
    background: color.primary,
    color: color.textPrimary,
    fontSize: font.size.lg,
    fontWeight: font.weight.semibold,
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontFamily: 'inherit',
  },
  saveBtnOff: {
    background: color.bgHover,
    color: color.textDisabled,
    cursor: 'default',
  },
  saveBtnOk: {
    background: color.success,
  },
}
