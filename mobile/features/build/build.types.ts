export type SlotKey = 'cpu' | 'cooler' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case'

export const SLOT_KEYS: readonly SlotKey[] = [
  'cpu', 'cooler', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case',
]

export interface CatalogOption {
  n: string
  s: string
  p: number
  sk?: string
  pm?: number
  mhz?: number
  gb?: number
  tb?: number
  read?: number
  watts?: number
  feat?: string
  vrs?: number
  tdp?: number
  coolerType?: 'air' | 'aio'
  sockets?: string[]
  /** Raw UserBenchmark sample count. Higher = more popular. Used for default sort. */
  samples?: number
  /** Brand key for logo lookup (e.g. 'amd', 'intel', 'corsair'). Lowercase, no spaces. */
  brand?: string
  /** Optional per-part image URL (e.g. Supabase Storage). Takes precedence over brand logo. */
  img?: string
}

export interface CatalogSlot {
  label: string
  ib: string
  ic: string
  hasPM: boolean
  opts: CatalogOption[]
}

export type Catalog = Record<SlotKey, CatalogSlot>

export type BuildState = Partial<Record<SlotKey, CatalogOption>>
