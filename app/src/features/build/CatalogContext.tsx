import { createContext, useContext, useEffect, useState } from 'react'
import { CATALOG } from './build.catalog'
import { SLOT_KEYS } from './build.types'
import type { Catalog } from './build.types'
import { fetchAndMergePrices } from './prices'

// ── Types ──

interface CatalogContextValue {
  /** Price-hydrated catalog. Falls back to hardcoded CATALOG while loading or on error. */
  catalog: Catalog
  /** True while the initial price fetch is in-flight. */
  loading: boolean
  /** Non-null if the price fetch failed — catalog still usable with hardcoded prices. */
  error: string | null
  /** Number of parts using hardcoded fallback prices (no live data). */
  staleCount: number
  /** Timestamp of the most recent successful price fetch, or null if never fetched. */
  fetchedAt: Date | null
  /** Manually re-fetch prices (e.g. after admin updates the prices table). */
  refetch: () => void
}

// ── Context ──

const CatalogContext = createContext<CatalogContextValue>({
  catalog: CATALOG,
  loading: false,
  error: null,
  staleCount: SLOT_KEYS.reduce((sum, k) => sum + CATALOG[k].opts.length, 0),
  fetchedAt: null,
  refetch: () => {},
})

// ── Provider ──

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog>(CATALOG)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [staleCount, setStaleCount] = useState(
    SLOT_KEYS.reduce((sum, k) => sum + CATALOG[k].opts.length, 0)
  )
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null)
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    fetchAndMergePrices()
      .then(result => {
        if (cancelled) return
        setCatalog(result.catalog)
        setStaleCount(result.staleCount)
        setFetchedAt(result.fetchedAt)
      })
      .catch(err => {
        if (cancelled) return
        // Degrade gracefully — hardcoded catalog is still functional
        setError(err instanceof Error ? err.message : 'Unknown price fetch error')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [trigger])

  const refetch = () => setTrigger(t => t + 1)

  return (
    <CatalogContext.Provider value={{ catalog, loading, error, staleCount, fetchedAt, refetch }}>
      {children}
    </CatalogContext.Provider>
  )
}

// ── Hook ──

export function useCatalog() {
  return useContext(CatalogContext)
}
