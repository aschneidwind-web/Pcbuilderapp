import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useCatalog } from './CatalogContext'
import { SLOT_KEYS } from './build.types'
import type { BuildState, CatalogOption, SlotKey } from './build.types'

interface BuildContextValue {
  build: BuildState
  totalPrice: number
  componentCount: number
  /** null = not enough info (CPU or MB missing); true/false = result */
  socketCompatible: boolean | null
  selectComponent: (slot: SlotKey, option: CatalogOption) => void
  clearComponent: (slot: SlotKey) => void
  clearAll: () => void
  /** Restore a build from a saved snapshot. Matches by component name against the catalog. */
  loadBuild: (components: Partial<Record<string, { name: string }>>) => void
}

export const BuildContext = createContext<BuildContextValue>({
  build: {},
  totalPrice: 0,
  componentCount: 0,
  socketCompatible: null,
  selectComponent: () => {},
  clearComponent: () => {},
  clearAll: () => {},
  loadBuild: () => {},
})

export function BuildProvider({ children }: { children: React.ReactNode }) {
  const { catalog } = useCatalog()
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
        const found = catalog[slot].opts.find(o => o.n === ref.name)
        if (found) next[slot] = found
      }
    }
    setBuild(next)
  }, [catalog])

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
    if (!cpu?.sk || !mb?.sk) return null
    return cpu.sk === mb.sk
  }, [build.cpu, build.motherboard])

  return (
    <BuildContext.Provider value={{
      build, totalPrice, componentCount, socketCompatible,
      selectComponent, clearComponent, clearAll, loadBuild,
    }}>
      {children}
    </BuildContext.Provider>
  )
}

export const useBuild = () => useContext(BuildContext)
