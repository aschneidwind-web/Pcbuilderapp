import type { BuildState } from './build.types'

// ── Reference ceilings (best options in our catalog) ──
const MAX_CPU_PM = 48500   // i9-14900K
const MAX_GPU_PM = 38500   // RTX 4080 Super

// ── Overall tiers ──

export interface Tier {
  name: string
  color: string
  min: number
  desc: string
}

export const TIERS: readonly Tier[] = [
  { name: 'Entry',     color: '#8E8E93', min: 0,
    desc: 'Good for web browsing, office work, and light gaming at 1080p on low settings.' },
  { name: 'Mid-range', color: '#0A84FF', min: 15000,
    desc: 'Solid 1080p and 1440p gaming, content creation, and everyday multitasking.' },
  { name: 'High-end',  color: '#34C759', min: 28000,
    desc: 'Excels at 4K gaming, professional video editing, 3D rendering, and heavy workloads.' },
  { name: 'Extreme',   color: '#BF5AF2', min: 38000,
    desc: 'No compromises. Handles 4K gaming, AI/ML workloads, and real-time 3D without breaking a sweat.' },
]

// ── Categories ──

export interface Category {
  id: string
  label: string
  /** Compute 0–100 score from raw PM values */
  score: (cpuPm: number, gpuPm: number) => number
}

export const CATEGORIES: readonly Category[] = [
  {
    id: 'gaming',
    label: 'Gaming',
    // GPU-dominant
    score: (_c, g) => clamp100(Math.round((g / MAX_GPU_PM) * 100)),
  },
  {
    id: 'desktop',
    label: 'Desktop',
    // CPU-dominant (browsing, office, multitasking)
    score: (c, _g) => clamp100(Math.round((c / MAX_CPU_PM) * 100)),
  },
  {
    id: 'workstation',
    label: 'Workstation',
    // Blended — rendering, video editing, AI/ML
    score: (c, g) => clamp100(Math.round(((c / MAX_CPU_PM) * 0.4 + (g / MAX_GPU_PM) * 0.6) * 100)),
  },
]

// ── Per-category tier names (same 4 tiers, mapped by % thresholds) ──

function categoryTierName(score: number): string {
  if (score >= 85) return 'Extreme'
  if (score >= 60) return 'High-end'
  if (score >= 35) return 'Mid-range'
  return 'Entry'
}

function categoryTierColor(score: number): string {
  if (score >= 85) return TIERS[3].color
  if (score >= 60) return TIERS[2].color
  if (score >= 35) return TIERS[1].color
  return TIERS[0].color
}

// ── Public API ──

/** Combined score: CPU PassMark × 0.45 + GPU PassMark × 0.55 */
export function computeBuildScore(build: BuildState): number {
  const cpuPm = build.cpu?.pm ?? 0
  const gpuPm = build.gpu?.pm ?? 0
  return Math.round(cpuPm * 0.45 + gpuPm * 0.55)
}

/** Returns the overall tier for the build, or null if neither CPU nor GPU is selected */
export function getTier(build: BuildState): Tier | null {
  if (!build.cpu && !build.gpu) return null
  const score = computeBuildScore(build)
  let tier = TIERS[0]
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (score >= TIERS[i].min) { tier = TIERS[i]; break }
  }
  return tier
}

export interface CategoryScore {
  id: string
  label: string
  score: number        // 0–100
  tierName: string     // Entry / Mid-range / High-end / Extreme
  tierColor: string
}

/** Compute per-category scores with tier names */
export function getCategoryScores(build: BuildState): CategoryScore[] {
  const cpuPm = build.cpu?.pm ?? 0
  const gpuPm = build.gpu?.pm ?? 0

  return CATEGORIES.map(cat => {
    const score = cat.score(cpuPm, gpuPm)
    return {
      id: cat.id,
      label: cat.label,
      score,
      tierName: categoryTierName(score),
      tierColor: categoryTierColor(score),
    }
  })
}

/** Context-aware upgrade suggestions based on build gaps */
export function getUpgradeSuggestions(build: BuildState): string[] {
  const suggestions: string[] = []
  const gpuPm = build.gpu?.pm ?? 0
  const cpuPm = build.cpu?.pm ?? 0

  if (!build.gpu || gpuPm < 18900) {
    suggestions.push('Add or upgrade your GPU — it has the biggest impact on gaming performance.')
  }
  if (!build.cpu || cpuPm < 25000) {
    suggestions.push('A stronger CPU will improve multitasking and workstation performance.')
  }

  const ramGb = build.ram?.gb
  const combined = computeBuildScore(build)
  if (ramGb && ramGb <= 16 && combined > 28000) {
    suggestions.push('Consider 32 GB RAM for heavy workloads at this performance tier.')
  }

  if (!build.storage || (build.storage.s ?? '').includes('HDD')) {
    suggestions.push('Upgrade to an NVMe SSD for dramatically faster load times.')
  }

  return suggestions
}

// ── Helpers ──

function clamp100(v: number): number {
  return Math.max(0, Math.min(100, v))
}
