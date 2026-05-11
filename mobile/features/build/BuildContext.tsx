import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CATALOG } from './build.catalog'
import { checkCoolerSocketCompat, checkSocketCompat } from './build.compatibility'
import { SLOT_KEYS } from './build.types'
import type { BuildState, CatalogOption, SlotKey } from './build.types'

interface BuildContextValue {
  build: BuildState
  totalPrice: number
  componentCount: number
  socketCompatible: boolean | null
  coolerCompatible: boolean | null
  selectComponent: (slot: SlotKey, option: CatalogOption) => void
  clearComponent: (slot: SlotKey) => void
  clearAll: () => void
  loadBuild: (components: Partial<Record<string, { name: string }>>) => void
}

export const BuildContext = createContext<BuildContextValue>({
  build: {},
  totalPrice: 0,
  componentCount: 0,
  socketCompatible: null,
  coolerCompatible: null,
  selectComponent: () => {},
  clearComponent: () => {},
  clearAll: () => {},
  loadBuild: () => {},
})

export function BuildProvider({ children }: { children: React.ReactNode }) {
  const [build, setBuild] = useState<BuildState>({})

  const selectComponent = useCallback((slot: SlotKey, option: CatalogOption) => {
    setBuild(prev => ({ ...prev, [slot]: option }))
  }, [])

  const clearComponent = useCallback((slot: SlotKey) => {
    setBuild(prev => {
      const next = { ...prev }
      delete next[slot]
      return next
    })
  }, [])

  const clearAll = useCallback(() => setBuild({}), [])

  const loadBuild = useCallback((components: Partial<Record<string, { name: string }>>) => {
    const next: BuildState = {}
    for (const slot of SLOT_KEYS) {
      const ref = components[slot]
      if (ref) {
        const found = CATALOG[slot].opts.find(o => o.n === ref.name)
        if (found) next[slot] = found
      }
    }
    setBuild(next)
  }, [])

  const totalPrice = useMemo(
    () => SLOT_KEYS.reduce((sum, k) => sum + (build[k]?.p ?? 0), 0),
    [build],
  )

  const componentCount = useMemo(
    () => SLOT_KEYS.filter(k => build[k] != null).length,
    [build],
  )

  const socketCompatible = useMemo((): boolean | null => {
    const cpu = build.cpu
    const mb = build.motherboard
    if (!cpu || !mb) return null
    return checkSocketCompat(cpu, mb)
  }, [build.cpu, build.motherboard])

  const coolerCompatible = useMemo((): boolean | null => {
    const cooler = build.cooler
    const cpu = build.cpu
    if (!cooler || !cpu) return null
    return checkCoolerSocketCompat(cooler, cpu)
  }, [build.cooler, build.cpu])

  return (
    <BuildContext.Provider value={{
      build, totalPrice, componentCount, socketCompatible, coolerCompatible,
      selectComponent, clearComponent, clearAll, loadBuild,
    }}>
      {children}
    </BuildContext.Provider>
  )
}

export const useBuild = () => useContext(BuildContext)
