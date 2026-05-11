import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { SLOT_KEYS } from './build.types'
import type { Catalog, CatalogOption, CatalogSlot, SlotKey } from './build.types'

const SLOT_META: Record<SlotKey, Omit<CatalogSlot, 'opts'>> = {
  cpu:         { label: 'CPU',         ib: '#7B2FFF', ic: '#ffffff', hasPM: false },
  cooler:      { label: 'CPU Cooler',  ib: '#7B2FFF', ic: '#ffffff', hasPM: false },
  gpu:         { label: 'GPU',         ib: '#7B2FFF', ic: '#ffffff', hasPM: false },
  motherboard: { label: 'Motherboard', ib: '#7B2FFF', ic: '#ffffff', hasPM: false },
  ram:         { label: 'RAM',         ib: '#7B2FFF', ic: '#ffffff', hasPM: false },
  storage:     { label: 'Storage',     ib: '#7B2FFF', ic: '#ffffff', hasPM: false },
  psu:         { label: 'PSU',         ib: '#7B2FFF', ic: '#ffffff', hasPM: false },
  case:        { label: 'Case',        ib: '#7B2FFF', ic: '#ffffff', hasPM: false },
}

interface PartRow {
  slot: string
  n: string
  s: string
  p: number | null
  sk?: string | null
  mhz?: number | null
  gb?: number | null
  tb?: number | null
  read?: number | null
  watts?: number | null
  feat?: string | null
  vrs?: number | null
  tdp?: number | null
  cooler_type?: string | null
  sockets?: string[] | null
}

function rowToOption(row: PartRow): CatalogOption | null {
  if (!row.p) return null
  return {
    n:          row.n,
    s:          row.s,
    p:          row.p,
    sk:         row.sk         ?? undefined,
    mhz:        row.mhz        ?? undefined,
    gb:         row.gb         ?? undefined,
    tb:         row.tb         ?? undefined,
    read:       row.read       ?? undefined,
    watts:      row.watts      ?? undefined,
    feat:       row.feat       ?? undefined,
    vrs:        row.vrs        ?? undefined,
    tdp:        row.tdp        ?? undefined,
    coolerType: (row.cooler_type as 'air' | 'aio') ?? undefined,
    sockets:    row.sockets    ?? undefined,
  }
}

interface UsePartsResult {
  catalog: Catalog | null
  partsLoading: boolean
  partsError: string | null
}

export function useParts(): UsePartsResult {
  const [catalog, setCatalog]       = useState<Catalog | null>(null)
  const [partsLoading, setLoading]  = useState(true)
  const [partsError, setError]      = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('parts')
        .select('slot,n,s,p,sk,mhz,gb,tb,read,watts,feat,vrs,tdp,cooler_type,sockets')
        .order('p', { ascending: true })

      if (cancelled) return

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      const grouped: Partial<Record<SlotKey, CatalogOption[]>> = {}
      for (const row of data as PartRow[]) {
        const slot = row.slot as SlotKey
        if (!SLOT_KEYS.includes(slot)) continue
        const opt = rowToOption(row)
        if (!opt) continue
        if (!grouped[slot]) grouped[slot] = []
        grouped[slot]!.push(opt)
      }

      const built = {} as Catalog
      for (const key of SLOT_KEYS) {
        built[key] = { ...SLOT_META[key], opts: grouped[key] ?? [] }
      }

      setCatalog(built)
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { catalog, partsLoading, partsError }
}
