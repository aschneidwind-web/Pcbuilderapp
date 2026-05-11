import type { CatalogOption } from './build.types'

export function checkCoolerSocketCompat(
  cooler: CatalogOption,
  cpu: CatalogOption,
): boolean | null {
  if (!cpu.sk || !cooler.sockets) return null
  return cooler.sockets.includes(cpu.sk)
}

export function checkSocketCompat(
  cpu: CatalogOption,
  motherboard: CatalogOption,
): boolean | null {
  if (!cpu.sk || !motherboard.sk) return null
  return cpu.sk === motherboard.sk
}
