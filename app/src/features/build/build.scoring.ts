import type { BuildState } from './build.types'

// ── Reference ceilings (best options in our catalog) ──
const MAX_CPU_PM = 48500   // i9-14900K
const MAX_GPU_PM = 38500   // RTX 4080 Super

// ── Tiers ──

export interface Tier {
  name: string
  color: string
  min: number
  desc: string
}

export const TIERS: readonly Tier[] = [
  { name: 'Entry',    color: '#8E8E93', min: 0,
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
  color: string
  /** Compute 0–100 score from raw PM values */
  score: (cpuPm: number, gpuPm: number) => number
  thresholds: readonly [number, number, number]
  labels: readonly [string, string, string, string]
}

export const CATEGORIES: readonly Category[] = [
  {
    id: 'g1080', label: '1080p Gaming', color: '#0A84FF',
    score: (_c, g) => clamp100(Math.round((g / MAX_GPU_PM) * 100)),
    thresholds: [30, 60, 80],
    labels: ['Struggling', 'Playable', 'High', 'Ultra'],
  },
  {
    id: 'g1440', label: '1440p Gaming', color: '#7B2FFF',
    // 1440p is harder — same GPU score but scaled to 80% ceiling
    score: (_c, g) => clamp100(Math.round((g / MAX_GPU_PM) * 80)),
    thresholds: [30, 55, 75],
    labels: ['Struggling', 'Playable', 'High', 'Ultra'],
  },
  {
    id: 'video', label: 'Video Editing', color: '#FF6B9D',
    score: (c, _g) => clamp100(Math.round((c / MAX_CPU_PM) * 100)),
    thresholds: [30, 55, 80],
    labels: ['Basic', '1080p', '4K capable', 'Pro 4K'],
  },
  {
    id: 'multi', label: 'Multitasking', color: '#10B981',
    score: (c, _g) => clamp100(Math.round((c / MAX_CPU_PM) * 100)),
    thresholds: [30, 55, 80],
    labels: ['Light', 'Moderate', 'Heavy', 'Extreme'],
  },
  {
    id: 'stream', label: 'Streaming', color: '#F59E0B',
    score: (c, g) => clamp100(Math.round(((c / MAX_CPU_PM + g / MAX_GPU_PM) / 2) * 100)),
    thresholds: [30, 55, 80],
    labels: ['720p', '1080p', '1080p60', '4K stream'],
  },
  {
    id: 'aiml', label: 'AI / ML', color: '#06B6D4',
    // Heavily GPU-dependent
    score: (_c, g) => clamp100(Math.round((g / MAX_GPU_PM) * 100)),
    thresholds: [25, 50, 75],
    labels: ['Not suited', 'Entry', 'Capable', 'Serious'],
  },
]

// ── Public API ──

/** Combined score: CPU PassMark × 0.45 + GPU PassMark × 0.55 */
export function computeBuildScore(build: BuildState): number {
  const cpuPm = build.cpu?.pm ?? 0
  const gpuPm = build.gpu?.pm ?? 0
  return Math.round(cpuPm * 0.45 + gpuPm * 0.55)
}

/** Returns the tier for the build, or null if neither CPU nor GPU are selected */
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
  color: string
  score: number       // 0–100
  rating: string      // human-readable label
}

/** Compute per-category scores with human-readable ratings */
export function getCategoryScores(build: BuildState): CategoryScore[] {
  const cpuPm = build.cpu?.pm ?? 0
  const gpuPm = build.gpu?.pm ?? 0

  return CATEGORIES.map(cat => {
    const score = cat.score(cpuPm, gpuPm)
    const rating = labelFromScore(score, cat.thresholds, cat.labels)
    return { id: cat.id, label: cat.label, color: cat.color, score, rating }
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

function labelFromScore(
  score: number,
  thresholds: readonly [number, number, number],
  labels: readonly [string, string, string, string],
): string {
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (score >= thresholds[i]) return labels[i + 1]
  }
  return labels[0]
}
