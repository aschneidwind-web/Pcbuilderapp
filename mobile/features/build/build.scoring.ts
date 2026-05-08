import type { BuildState } from './build.types'
import { CATALOG } from './build.catalog'

const MAX_CPU_PM = Math.max(...CATALOG.cpu.opts.map(o => o.pm ?? 0))
const MAX_GPU_PM = Math.max(...CATALOG.gpu.opts.map(o => o.pm ?? 0))

export interface Tier {
  name: string
  color: string
  min: number
  desc: string
}

export const TIERS: readonly Tier[] = [
  { name: 'Entry',     color: '#FF3B30', min: 0,
    desc: 'Good for web browsing, office work, and light gaming at 1080p on low settings.' },
  { name: 'Mid-range', color: '#FF9500', min: 15000,
    desc: 'Solid 1080p and 1440p gaming, content creation, and everyday multitasking.' },
  { name: 'High-end',  color: '#FFD60A', min: 28000,
    desc: 'Excels at 4K gaming, professional video editing, 3D rendering, and heavy workloads.' },
  { name: 'Extreme',   color: '#34C759', min: 38000,
    desc: 'No compromises. Handles 4K gaming, AI/ML workloads, and real-time 3D without breaking a sweat.' },
]

export interface Category {
  id: string
  label: string
  score: (cpuPm: number, gpuPm: number) => number
}

export const CATEGORIES: readonly Category[] = [
  {
    id: 'gaming',
    label: 'Gaming',
    score: (_c, g) => clamp100(Math.round((g / MAX_GPU_PM) * 100)),
  },
  {
    id: 'desktop',
    label: 'Desktop',
    score: (c, _g) => clamp100(Math.round((c / MAX_CPU_PM) * 100)),
  },
  {
    id: 'workstation',
    label: 'Workstation',
    score: (c, g) => clamp100(Math.round(((c / MAX_CPU_PM) * 0.4 + (g / MAX_GPU_PM) * 0.6) * 100)),
  },
]

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

export function computeBuildScore(build: BuildState): number {
  const cpuPm = build.cpu?.pm ?? 0
  const gpuPm = build.gpu?.pm ?? 0
  return Math.round(cpuPm * 0.45 + gpuPm * 0.55)
}

export function getTier(build: BuildState): Tier | null {
  if (!build.cpu || !build.gpu || !build.motherboard || !build.ram || !build.storage) return null
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
  score: number
  tierName: string
  tierColor: string
}

export function getCategoryScores(build: BuildState): CategoryScore[] {
  const cpuPm = build.cpu?.pm ?? 0
  const gpuPm = build.gpu?.pm ?? 0

  return CATEGORIES.map(cat => {
    const score = cat.score(cpuPm, gpuPm)
    return { id: cat.id, label: cat.label, score, tierName: categoryTierName(score), tierColor: categoryTierColor(score) }
  })
}

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

function clamp100(v: number): number {
  return Math.max(0, Math.min(100, v))
}
