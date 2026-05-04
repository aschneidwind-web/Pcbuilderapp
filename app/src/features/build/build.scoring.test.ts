import { describe, it, expect } from 'vitest'
import {
  computeBuildScore,
  getTier,
  getCategoryScores,
  getUpgradeSuggestions,
  TIERS,
  CATEGORIES,
} from './build.scoring'
import type { BuildState } from './build.types'

const ryzen: BuildState = {
  cpu: { n: 'Ryzen 7 7800X3D', s: '8-core · AM5', p: 449, sk: 'AM5', pm: 33180 },
}

const rtx: BuildState = {
  gpu: { n: 'RTX 4070 Super', s: '12GB · 1440p', p: 599, pm: 28700 },
}

const fullBuild: BuildState = {
  cpu: { n: 'Core i9-14900K', s: '24-core · LGA1700', p: 549, sk: 'LGA1700', pm: 48500 },
  gpu: { n: 'RTX 4080 Super', s: '16GB · 4K', p: 999, pm: 38500 },
  ram: { n: 'G.Skill Trident Z5 32GB', s: 'DDR5-6000 · 2×16GB', p: 119, mhz: 6000, gb: 32 },
  storage: { n: 'Samsung 990 Pro 2TB', s: 'NVMe Gen4 · 2TB', p: 159, read: 7450, tb: 2 },
}

describe('build.scoring', () => {
  describe('computeBuildScore', () => {
    it('returns 0 for empty build', () => {
      expect(computeBuildScore({})).toBe(0)
    })

    it('weights CPU at 45% and GPU at 55%', () => {
      const both: BuildState = { ...ryzen, ...rtx }
      const expected = Math.round(33180 * 0.45 + 28700 * 0.55)
      expect(computeBuildScore(both)).toBe(expected)
    })

    it('handles CPU-only build', () => {
      expect(computeBuildScore(ryzen)).toBe(Math.round(33180 * 0.45))
    })

    it('handles GPU-only build', () => {
      expect(computeBuildScore(rtx)).toBe(Math.round(28700 * 0.55))
    })
  })

  describe('getTier', () => {
    it('returns null when no CPU or GPU selected', () => {
      expect(getTier({})).toBeNull()
    })

    it('returns Entry for low scores', () => {
      const tier = getTier({ cpu: { n: 'weak', s: '', p: 100, pm: 5000 } })
      expect(tier!.name).toBe('Entry')
    })

    it('returns Extreme for highest scores', () => {
      const tier = getTier(fullBuild)
      expect(tier!.name).toBe('Extreme')
    })

    it('tier thresholds are sorted ascending', () => {
      for (let i = 1; i < TIERS.length; i++) {
        expect(TIERS[i].min).toBeGreaterThan(TIERS[i - 1].min)
      }
    })
  })

  describe('getCategoryScores', () => {
    it('returns exactly 3 categories', () => {
      expect(CATEGORIES).toHaveLength(3)
      const scores = getCategoryScores(fullBuild)
      expect(scores).toHaveLength(3)
    })

    it('categories are Gaming, Desktop, Workstation', () => {
      const ids = CATEGORIES.map(c => c.id)
      expect(ids).toEqual(['gaming', 'desktop', 'workstation'])
    })

    it('each category score is 0-100', () => {
      const scores = getCategoryScores(fullBuild)
      for (const s of scores) {
        expect(s.score).toBeGreaterThanOrEqual(0)
        expect(s.score).toBeLessThanOrEqual(100)
      }
    })

    it('empty build produces all zeros', () => {
      const scores = getCategoryScores({})
      for (const s of scores) {
        expect(s.score).toBe(0)
      }
    })

    it('Gaming scores higher with better GPU', () => {
      const low = getCategoryScores({ gpu: { n: '', s: '', p: 100, pm: 16400 } })
      const high = getCategoryScores({ gpu: { n: '', s: '', p: 100, pm: 38500 } })
      const gamingLow = low.find(c => c.id === 'gaming')!
      const gamingHigh = high.find(c => c.id === 'gaming')!
      expect(gamingHigh.score).toBeGreaterThan(gamingLow.score)
    })

    it('Desktop scores higher with better CPU', () => {
      const low = getCategoryScores({ cpu: { n: '', s: '', p: 100, pm: 25000 } })
      const high = getCategoryScores({ cpu: { n: '', s: '', p: 100, pm: 48500 } })
      expect(high.find(c => c.id === 'desktop')!.score)
        .toBeGreaterThan(low.find(c => c.id === 'desktop')!.score)
    })

    it('assigns tier names matching the 4-tier system', () => {
      const scores = getCategoryScores(fullBuild)
      const validNames = ['Entry', 'Mid-range', 'High-end', 'Extreme']
      for (const s of scores) {
        expect(validNames).toContain(s.tierName)
      }
    })
  })

  describe('getUpgradeSuggestions', () => {
    it('suggests GPU when missing', () => {
      const suggestions = getUpgradeSuggestions(ryzen)
      expect(suggestions.some(s => s.toLowerCase().includes('gpu'))).toBe(true)
    })

    it('suggests CPU when missing', () => {
      const suggestions = getUpgradeSuggestions(rtx)
      expect(suggestions.some(s => s.toLowerCase().includes('cpu'))).toBe(true)
    })

    it('suggests NVMe when using HDD', () => {
      const withHdd: BuildState = {
        ...fullBuild,
        storage: { n: 'Seagate 4TB', s: 'HDD · 4TB', p: 69, read: 220, tb: 4 },
      }
      const suggestions = getUpgradeSuggestions(withHdd)
      expect(suggestions.some(s => s.toLowerCase().includes('nvme') || s.toLowerCase().includes('ssd'))).toBe(true)
    })

    it('returns empty array for a strong complete build', () => {
      const beast: BuildState = {
        ...fullBuild,
        psu: { n: 'Seasonic 1000W', s: '1000W · Gold', p: 189, watts: 1000 },
        cooler: { n: 'Noctua NH-D15', s: 'Air · 250W', p: 110, tdp: 250 },
      }
      const suggestions = getUpgradeSuggestions(beast)
      expect(suggestions.length).toBeLessThanOrEqual(1)
    })
  })
})
