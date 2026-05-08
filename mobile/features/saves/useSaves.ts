import { useCallback, useEffect, useState } from 'react'
import * as api from './saves.api'
import type { NewSavedBuild, SavedBuild } from './saves.types'

interface UseSavesResult {
  builds: SavedBuild[]
  loading: boolean
  error: string | null
  createSave: (input: NewSavedBuild) => Promise<SavedBuild>
  deleteSave: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

const validate = (input: NewSavedBuild): void => {
  if (!input.name.trim()) throw new Error('Build name is required')
  const componentCount = Object.values(input.components).filter(Boolean).length
  if (componentCount === 0) throw new Error('Build must have at least one component')
}

export const useSaves = (): UseSavesResult => {
  const [builds, setBuilds] = useState<SavedBuild[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.fetchSaves()
      setBuilds(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load builds')
      setBuilds([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const createSave = useCallback(async (input: NewSavedBuild): Promise<SavedBuild> => {
    validate(input)
    const created = await api.createSave(input)
    setBuilds(prev => [created, ...prev])
    return created
  }, [])

  const deleteSave = useCallback(async (id: string): Promise<void> => {
    const snapshot = builds
    setBuilds(prev => prev.filter(b => b.id !== id))
    try {
      await api.deleteSave(id)
    } catch (e) {
      setBuilds(snapshot)
      throw e
    }
  }, [builds])

  return { builds, loading, error, createSave, deleteSave, refresh }
}
