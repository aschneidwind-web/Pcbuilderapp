import { useMemo, useState } from 'react'
import type { BuildState } from './build.types'
import {
  computeBuildScore,
  getTier,
  getCategoryScores,
  getUpgradeSuggestions,
} from './build.scoring'

interface Props {
  build: BuildState
}

const MAX_SCORE = 43000

export function BuildReport({ build }: Props) {
  const [open, setOpen] = useState(false)

  const tier = useMemo(() => getTier(build), [build])
  const score = useMemo(() => computeBuildScore(build), [build])
  const categories = useMemo(() => getCategoryScores(build), [build])
  const suggestions = useMemo(() => getUpgradeSuggestions(build), [build])

  if (!tier) return null

  const pct = Math.min(100, Math.round((score / MAX_SCORE) * 100))

  return (
    <div style={s.wrap}>
      {/* ── Toggle header ── */}
      <div style={s.toggle} onClick={() => setOpen(v => !v)}>
        <span style={s.toggleLabel}>Build Report</span>
        <div style={s.toggleRight}>
          <span style={{ ...s.toggleTier, color: tier.color }}>{tier.name}</span>
          <svg
            viewBox="0 0 24 24" width="16" height="16" fill="none"
            stroke="#6B6B80" strokeWidth="2" strokeLinecap="round"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {!open ? null : (
        <div style={s.body}>
          {/* ── Overall score ── */}
          <div style={s.overallRow}>
            <div>
              <div style={{ ...s.tierName, color: tier.color }}>{tier.name}</div>
              <div style={s.scoreLine}>{score.toLocaleString()} · {pct}%</div>
            </div>
            <div style={s.overallBar}>
              <div style={{ ...s.overallFill, width: `${pct}%`, background: tier.color }} />
            </div>
          </div>
          <div style={s.tierDesc}>{tier.desc}</div>

          {/* ── 3 Categories ── */}
          <div style={s.catGrid}>
            {categories.map(cat => (
              <div key={cat.id} style={s.catCard}>
                <div style={s.catHeader}>
                  <span style={s.catLabel}>{cat.label}</span>
                  <span style={s.catPct}>{cat.score}%</span>
                </div>
                <div style={s.catBar}>
                  <div style={{
                    ...s.catFill,
                    width: `${cat.score}%`,
                    background: cat.tierColor,
                  }} />
                </div>
                <span style={{ ...s.catTier, color: cat.tierColor }}>{cat.tierName}</span>
              </div>
            ))}
          </div>

          {/* ── Suggestions ── */}
          {suggestions.length > 0 && (
            <div style={s.suggestWrap}>
              {suggestions.map((text, i) => (
                <div key={i} style={s.suggestRow}>
                  <div style={s.suggestDot} />
                  <div style={s.suggestTxt}>{text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  wrap: {
    margin: '0 20px 12px',
    background: 'rgba(255,255,255,0.03)',
    border: '0.5px solid rgba(255,255,255,0.06)',
    borderRadius: 14,
    overflow: 'hidden',
  },

  // Toggle
  toggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '13px 16px',
    cursor: 'pointer',
    userSelect: 'none' as const,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  toggleRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  toggleTier: {
    fontSize: 13,
    fontWeight: 600,
  },

  // Body
  body: {
    padding: '0 16px 16px',
  },

  // Overall
  overallRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    paddingBottom: 8,
  },
  tierName: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: '-0.3px',
  },
  scoreLine: {
    fontSize: 12,
    color: '#6B6B80',
    marginTop: 1,
  },
  overallBar: {
    flex: 1,
    height: 5,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  overallFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.4s ease',
  },
  tierDesc: {
    fontSize: 12,
    color: '#6B6B80',
    lineHeight: '1.45',
    paddingBottom: 14,
    borderBottom: '0.5px solid rgba(255,255,255,0.06)',
  },

  // Categories
  catGrid: {
    paddingTop: 14,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 14,
    paddingBottom: 14,
  },
  catCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 5,
  },
  catHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  catLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  catPct: {
    fontSize: 13,
    fontWeight: 600,
    color: '#AAAABC',
  },
  catBar: {
    height: 5,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  catFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.4s ease',
  },
  catTier: {
    fontSize: 11,
    fontWeight: 600,
  },

  // Suggestions
  suggestWrap: {
    borderTop: '0.5px solid rgba(255,255,255,0.06)',
    paddingTop: 12,
  },
  suggestRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 8,
    alignItems: 'flex-start' as const,
  },
  suggestDot: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    marginTop: 5,
    flexShrink: 0,
  },
  suggestTxt: {
    fontSize: 12,
    color: '#6B6B80',
    lineHeight: '1.4',
  },
}
