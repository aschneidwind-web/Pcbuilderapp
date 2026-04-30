import { describe, it, expect } from 'vitest'
import { computePtp, toComparable, sortByMode, sortByPrice } from './compare.utils'
import type { ComparableOption } from './compare.types'

describe('computePtp', () => {
  it('rounds points per dollar correctly', () => {
    expect(computePtp(25140, 229)).toBe(110)
    expect(computePtp(18900, 299)).toBe(63)
  })

  it('throws RangeError on zero price', () => {
    expect(() => computePtp(25140, 0)).toThrow(RangeError)
  })

  it('throws RangeError on negative price', () => {
    expect(() => computePtp(25140, -1)).toThrow(RangeError)
  })
})

describe('toComparable', () => {
  it('converts a valid PM option', () => {
    const result = toComparable({ n: 'RTX 4060', s: '8GB GDDR6', p: 299, pm: 18900 })
    expect(result).toEqual({ n: 'RTX 4060', s: '8GB GDDR6', p: 299, pm: 18900, ptp: 63 })
  })

  it('throws TypeError when pm is missing', () => {
    expect(() => toComparable({ n: 'NZXT H510', s: 'Mid-tower', p: 89 })).toThrow(TypeError)
  })
})

describe('sortByMode', () => {
  const items: ComparableOption[] = [
    { n: 'A', s: '', p: 500, pm: 30000, ptp: 60 },
    { n: 'B', s: '', p: 300, pm: 20000, ptp: 66 },
    { n: 'C', s: '', p: 800, pm: 40000, ptp: 50 },
  ]

  it('sorts by value (ptp desc)', () => {
    expect(sortByMode(items, 'value').map(x => x.n)).toEqual(['B', 'A', 'C'])
  })

  it('sorts by perf (pm desc)', () => {
    expect(sortByMode(items, 'perf').map(x => x.n)).toEqual(['C', 'A', 'B'])
  })

  it('sorts by price (p asc)', () => {
    expect(sortByMode(items, 'price').map(x => x.n)).toEqual(['B', 'A', 'C'])
  })

  it('does not mutate the input array', () => {
    const original = items.map(x => ({ ...x }))
    sortByMode(items, 'value')
    expect(items).toEqual(original)
  })
})

describe('sortByPrice', () => {
  it('sorts ascending by price', () => {
    const items = [{ p: 200, n: 'A' }, { p: 50, n: 'B' }, { p: 100, n: 'C' }]
    expect(sortByPrice(items).map(x => x.n)).toEqual(['B', 'C', 'A'])
  })

  it('does not mutate the input array', () => {
    const items = [{ p: 200 }, { p: 50 }]
    sortByPrice(items)
    expect(items[0].p).toBe(200)
  })
})
