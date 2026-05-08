import type { SlotKey } from '../build/build.types'

export type SortMode = 'value' | 'perf' | 'price_asc' | 'price_desc'

export interface ComparableOption {
  n: string
  s: string
  p: number
  pm: number
  ptp: number
}

export interface CompareState {
  slot: SlotKey
  sort: SortMode
}
