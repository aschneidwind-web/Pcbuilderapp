import { supabase } from '../../lib/supabase'
import { CATALOG } from './build.catalog'
import { SLOT_KEYS } from './build.types'
import type { Catalog, CatalogOption } from './build.types'

// ── Types ──

export interface PriceRow {
  part_name: string
  slot: string
  price_cents: number
  fetched_at: string
}

export interface PriceFetchResult {
  catalog: Catalog
  staleCount: number        // parts with no live price (using hardcoded fallback)
  fetchedAt: Date | null     // newest fetched_at from the result set
}

// ── Fetch ──

export async function fetchPriceMap(): Promise<Map<string, number>> {
  const { data, error } = await supabase
    .from('prices')
    .select('part_name, price_cents')

  if (error) throw new Error(`Price fetch failed: ${error.message}`)

  return new Map(
    (data as Pick<PriceRow, 'part_name' | 'price_cents'>[]).map(
      r => [r.part_name, r.price_cents / 100]
    )
  )
}

// ── Merge ──

/**
 * Produces a new Catalog with live prices overlaid.
 * Parts missing from the price map keep their hardcoded fallback price.
 * Never mutates the original CATALOG.
 */
export function mergePrices(priceMap: Map<string, number>): PriceFetchResult {
  let staleCount = 0

  const catalog = {} as Catalog
  for (const slot of SLOT_KEYS) {
    const source = CATALOG[slot]
    const opts: CatalogOption[] = source.opts.map(opt => {
      const live = priceMap.get(opt.n)
      if (live == null) {
        staleCount++
        return opt // unchanged — hardcoded fallback
      }
      return { ...opt, p: live }
    })
    catalog[slot] = { ...source, opts }
  }

  return { catalog, staleCount, fetchedAt: new Date() }
}

// ── Combined convenience ──

export async function fetchAndMergePrices(): Promise<PriceFetchResult> {
  const priceMap = await fetchPriceMap()
  return mergePrices(priceMap)
}
