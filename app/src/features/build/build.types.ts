export type SlotKey = 'cpu' | 'cooler' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case'

export const SLOT_KEYS: readonly SlotKey[] = [
  'cpu', 'cooler', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case',
]

export interface CatalogOption {
  n: string       // display name
  s: string       // spec string
  p: number       // price (USD)
  sk?: string     // socket key — used for CPU/motherboard compatibility
  pm?: number     // PassMark score (cpu, gpu)
  mhz?: number    // RAM MHz
  gb?: number     // RAM GB
  tb?: number     // storage TB
  read?: number   // storage sequential read MB/s
  watts?: number  // PSU wattage
  feat?: string   // motherboard features string
  vrs?: number    // PCIe version
  tdp?: number    // cooler TDP rating in watts
}

export interface CatalogSlot {
  label: string
  ib: string       // icon background color
  ic: string       // icon foreground color
  icon: string     // SVG markup string
  hasPM: boolean   // whether PassMark scores are available for this category
  opts: CatalogOption[]
}

export type Catalog = Record<SlotKey, CatalogSlot>

// Current build selections — undefined means "not yet chosen"
export type BuildState = Partial<Record<SlotKey, CatalogOption>>
