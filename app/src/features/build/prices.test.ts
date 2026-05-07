import { describe, it, expect } from 'vitest'
import { mergePrices } from './prices'
import { CATALOG } from './build.catalog'
import { SLOT_KEYS } from './build.types'

describe('mergePrices', () => {
  it('returns the original catalog structure with all slots', () => {
    const result = mergePrices(new Map())
    for (const slot of SLOT_KEYS) {
      expect(result.catalog[slot]).toBeDefined()
      expect(result.catalog[slot].label).toBe(CATALOG[slot].label)
      expect(result.catalog[slot].opts.length).toBe(CATALOG[slot].opts.length)
    }
  })

  it('does not mutate the original CATALOG', () => {
    const originalPrice = CATALOG.cpu.opts[0].p
    const priceMap = new Map([[CATALOG.cpu.opts[0].n, 999.99]])
    mergePrices(priceMap)
    expect(CATALOG.cpu.opts[0].p).toBe(originalPrice)
  })

  it('overlays live prices when present in the map', () => {
    const target = CATALOG.gpu.opts[0]
    const newPrice = 249.99
    const priceMap = new Map([[target.n, newPrice]])

    const result = mergePrices(priceMap)
    const merged = result.catalog.gpu.opts.find(o => o.n === target.n)

    expect(merged).toBeDefined()
    expect(merged!.p).toBe(newPrice)
  })

  it('preserves all non-price fields when overlaying', () => {
    const target = CATALOG.cpu.opts[1] // 7800X3D — has sk, pm
    const priceMap = new Map([[target.n, 399]])

    const result = mergePrices(priceMap)
    const merged = result.catalog.cpu.opts.find(o => o.n === target.n)!

    expect(merged.p).toBe(399)
    expect(merged.n).toBe(target.n)
    expect(merged.s).toBe(target.s)
    expect(merged.sk).toBe(target.sk)
    expect(merged.pm).toBe(target.pm)
  })

  it('falls back to hardcoded price when part is missing from map', () => {
    const result = mergePrices(new Map()) // empty map = all fallbacks
    for (const slot of SLOT_KEYS) {
      for (let i = 0; i < result.catalog[slot].opts.length; i++) {
        expect(result.catalog[slot].opts[i].p).toBe(CATALOG[slot].opts[i].p)
      }
    }
  })

  it('counts stale parts (missing from price map)', () => {
    const totalParts = SLOT_KEYS.reduce(
      (sum, k) => sum + CATALOG[k].opts.length, 0
    )

    // Empty map: all parts are stale
    const allStale = mergePrices(new Map())
    expect(allStale.staleCount).toBe(totalParts)

    // Map with one entry: staleCount = totalParts - 1
    const oneEntry = new Map([[CATALOG.cpu.opts[0].n, 100]])
    const mostlyStale = mergePrices(oneEntry)
    expect(mostlyStale.staleCount).toBe(totalParts - 1)
  })

  it('sets fetchedAt to a recent Date', () => {
    const before = new Date()
    const result = mergePrices(new Map())
    const after = new Date()
    expect(result.fetchedAt).toBeInstanceOf(Date)
    expect(result.fetchedAt!.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(result.fetchedAt!.getTime()).toBeLessThanOrEqual(after.getTime())
  })

  it('handles partial price coverage correctly', () => {
    // Price only for the first CPU and first GPU
    const priceMap = new Map([
      [CATALOG.cpu.opts[0].n, 199],
      [CATALOG.gpu.opts[0].n, 259],
    ])
    const result = mergePrices(priceMap)

    expect(result.catalog.cpu.opts[0].p).toBe(199)
    expect(result.catalog.gpu.opts[0].p).toBe(259)
    // Second CPU should still have hardcoded price
    expect(result.catalog.cpu.opts[1].p).toBe(CATALOG.cpu.opts[1].p)
  })

  it('preserves slot metadata (icon, ib, ic, hasPM)', () => {
    const result = mergePrices(new Map())
    for (const slot of SLOT_KEYS) {
      expect(result.catalog[slot].icon).toBe(CATALOG[slot].icon)
      expect(result.catalog[slot].ib).toBe(CATALOG[slot].ib)
      expect(result.catalog[slot].ic).toBe(CATALOG[slot].ic)
      expect(result.catalog[slot].hasPM).toBe(CATALOG[slot].hasPM)
    }
  })
})
