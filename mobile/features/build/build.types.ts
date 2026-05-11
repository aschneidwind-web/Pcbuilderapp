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
