import { useMemo } from 'react'
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

const MAX_SCORE = 80000

export function BuildReport({ build }: Props) {
  const tier = useMemo(() => getTier(build), [build])
  const score = useMemo(() => computeBuildScore(build), [build])
  const categories = useMemo(() => getCategoryScores(build), [build])
  const suggestions = useMemo(() => getUpgradeSuggestions(build), [build])

  // Don't render until at least CPU or GPU is selected
  if (!tier) return null

  const pct = Math.min(100, Math.round((score / MAX_SCORE) * 100))
  // SVG ring math: circumference = 2πr, r=28 → C≈175.9
  const circum = 175.9
  const dashLen = Math.round(pct * circum / 100)

  return (
    <div style={s.wrap}>
      {/* ── Tier hero ── */}
      <div style={s.hero}>
        <div style={s.heroLeft}>
          <div style={{ ...s.tierName, color: tier.color }}>{tier.name}</div>
          <div style={s.tierScore}>Score: {score.toLocaleString()}</div>
        </div>
        <div style={s.ring}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none"
              stroke="rgba(255,255,255,0.06)" strokeWidth="4.5"
            />
            <circle cx="32" cy="32" r="28" fill="none"
              stroke={tier.color} strokeWidth="4.5" strokeLinecap="round"
              strokeDasharray={`${dashLen} ${circum}`}
              transform="rotate(-90 32 32)"
            />
          </svg>
          <div style={s.ringPct}>{pct}%</div>
        </div>
      </div>
      <div style={s.tierDesc}>{tier.desc}</div>

      {/* ── Category bars ── */}
      <div style={s.catGrid}>
        {categories.map(cat => (
          <div key={cat.id} style={s.catRow}>
            <div style={s.catTop}>
              <span style={s.catLabel}>{cat.label}</span>
              <span style={{ ...s.catBadge, color: cat.color, background: `${cat.color}18` }}>
                {cat.rating}
              </span>
            </div>
            <div style={s.barTrack}>
              <div style={{
                ...s.barFill,
                width: `${cat.score}%`,
                background: cat.color,
              }} />
            </div>
            <div style={s.catPct}>{cat.score}%</div>
          </div>
        ))}
      </div>

      {/* ── Score breakdown ── */}
      <div style={s.breakdownTitle}>Score breakdown</div>
      {build.cpu?.pm != null && (
        <BreakdownRow label="CPU" value={build.cpu.pm} max={48500} color="#7B2FFF" />
      )}
      {build.gpu?.pm != null && (
        <BreakdownRow label="GPU" value={build.gpu.pm} max={38500} color="#FF6B9D" />
      )}
      <BreakdownRow label="Combined" value={score} max={MAX_SCORE} color="#6B6B80" />

      {/* ── Upgrade suggestions ── */}
      {suggestions.length > 0 && (
        <div style={s.suggestWrap}>
          <div style={s.suggestTitle}>Suggested upgrades</div>
          {suggestions.map((text, i) => (
            <div key={i} style={s.suggestRow}>
              <div style={s.suggestDot} />
              <div style={s.suggestTxt}>{text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Breakdown bar sub-component ──

function BreakdownRow({ label, value, max, color }: {
  label: string; value: number; max: number; color: string
}) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div style={s.bkRow}>
      <span style={s.bkLabel}>{label}</span>
      <div style={s.bkTrack}>
        <div style={{ ...s.bkFill, width: `${pct}%`, background: color }} />
      </div>
      <span style={s.bkVal}>{value.toLocaleString()}</span>
    </div>
  )
}

// ── Styles ──

const s: Record<string, React.CSSProperties> = {
  wrap: {
    padding: '0 20px 16px',
  },

  // Hero
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 0 8px',
  },
  heroLeft: { flex: 1 },
  tierName: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: '-0.3px',
  },
  tierScore: {
    fontSize: 13,
    color: '#6B6B80',
    marginTop: 2,
  },
  ring: {
    position: 'relative' as const,
    width: 64,
    height: 64,
    flexShrink: 0,
  },
  ringPct: {
    position: 'absolute' as const,
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  tierDesc: {
    fontSize: 13,
    color: '#6B6B80',
    lineHeight: '1.45',
    paddingBottom: 16,
    borderBottom: '0.5px solid rgba(255,255,255,0.06)',
  },

  // Category bars
  catGrid: {
    paddingTop: 14,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
    paddingBottom: 16,
    borderBottom: '0.5px solid rgba(255,255,255,0.06)',
  },
  catRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  catTop: {
    width: 120,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
  },
  catLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  catBadge: {
    fontSize: 10,
    fontWeight: 600,
    borderRadius: 4,
    padding: '1px 5px',
    alignSelf: 'flex-start' as const,
  },
  barTrack: {
    flex: 1,
    height: 5,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.4s ease',
  },
  catPct: {
    width: 32,
    textAlign: 'right' as const,
    fontSize: 11,
    color: '#6B6B80',
    flexShrink: 0,
  },

  // Breakdown
  breakdownTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    paddingTop: 14,
    paddingBottom: 10,
  },
  bkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  bkLabel: {
    width: 70,
    fontSize: 12,
    color: '#6B6B80',
    flexShrink: 0,
  },
  bkTrack: {
    flex: 1,
    height: 4,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  bkFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.4s ease',
  },
  bkVal: {
    width: 52,
    textAlign: 'right' as const,
    fontSize: 12,
    fontWeight: 500,
    color: '#FFFFFF',
    flexShrink: 0,
  },

  // Suggestions
  suggestWrap: {
    marginTop: 14,
    background: 'rgba(255,255,255,0.03)',
    border: '0.5px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: '12px 14px',
  },
  suggestTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  suggestRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 8,
    alignItems: 'flex-start' as const,
  },
  suggestDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: '#F59E0B',
    marginTop: 5,
    flexShrink: 0,
  },
  suggestTxt: {
    fontSize: 12,
    color: '#6B6B80',
    lineHeight: '1.4',
  },
}
