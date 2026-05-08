import type { CatalogOption } from '../build/build.types'
import type { ComparableOption, SortMode } from './compare.types'

export function computePtp(pm: number, price: number): number {
  if (price <= 0) throw new RangeError('price must be greater than 0')
  return Math.round(pm / price)
}

export function toComparable(opt: CatalogOption): ComparableOption {
  if (opt.pm == null) throw new TypeError(`"${opt.n}" has no PassMark score`)
  return { n: opt.n, s: opt.s, p: opt.p, pm: opt.pm, ptp: computePtp(opt.pm, opt.p) }
}

export function sortByMode(items: ComparableOption[], mode: SortMode): ComparableOption[] {
  const sorted = [...items]
  if (mode === 'value')      return sorted.sort((a, b) => b.ptp - a.ptp)
  if (mode === 'perf')       return sorted.sort((a, b) => b.pm - a.pm)
  if (mode === 'price_desc') return sorted.sort((a, b) => b.p - a.p)
  return sorted.sort((a, b) => a.p - b.p)
}

export function sortByPrice<T extends { p: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.p - b.p)
}
