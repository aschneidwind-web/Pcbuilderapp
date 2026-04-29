import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useSaves } from './useSaves'
import * as api from './saves.api'
import type { SavedBuild } from './saves.types'

vi.mock('./saves.api')

const mockBuild: SavedBuild = {
  id: 'build-1',
  userId: 'user-1',
  name: 'My first rig',
  components: {
    cpu: { name: 'Ryzen 7 7800X3D', price: 449 },
    gpu: { name: 'RTX 4070 Super', price: 599 },
  },
  totalPrice: 1048,
  createdAt: '2026-01-15T10:00:00Z',
}

describe('useSaves', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loading', () => {
    it('fetches builds for the current user on mount', async () => {
      vi.mocked(api.fetchSaves).mockResolvedValue([mockBuild])

      const { result } = renderHook(() => useSaves())

      expect(result.current.loading).toBe(true)
      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.builds).toEqual([mockBuild])
      expect(api.fetchSaves).toHaveBeenCalledOnce()
    })

    it('exposes the error when fetching fails', async () => {
      vi.mocked(api.fetchSaves).mockRejectedValue(new Error('network'))

      const { result } = renderHook(() => useSaves())

      await waitFor(() => expect(result.current.loading).toBe(false))
      expect(result.current.error).toBe('network')
      expect(result.current.builds).toEqual([])
    })
  })

  describe('createSave', () => {
    it('rejects an empty name before hitting the API', async () => {
      vi.mocked(api.fetchSaves).mockResolvedValue([])
      const { result } = renderHook(() => useSaves())
      await waitFor(() => expect(result.current.loading).toBe(false))

      await expect(
        result.current.createSave({ name: '   ', components: {} })
      ).rejects.toThrow(/name/i)
      expect(api.createSave).not.toHaveBeenCalled()
    })

    it('rejects a build with no components', async () => {
      vi.mocked(api.fetchSaves).mockResolvedValue([])
      const { result } = renderHook(() => useSaves())
      await waitFor(() => expect(result.current.loading).toBe(false))

      await expect(
        result.current.createSave({ name: 'Empty', components: {} })
      ).rejects.toThrow(/component/i)
      expect(api.createSave).not.toHaveBeenCalled()
    })

    it('prepends the new build on success', async () => {
      vi.mocked(api.fetchSaves).mockResolvedValue([])
      vi.mocked(api.createSave).mockResolvedValue(mockBuild)

      const { result } = renderHook(() => useSaves())
      await waitFor(() => expect(result.current.loading).toBe(false))

      await act(async () => {
        await result.current.createSave({
          name: mockBuild.name,
          components: mockBuild.components,
        })
      })

      expect(result.current.builds).toEqual([mockBuild])
    })
  })

  describe('deleteSave', () => {
    it('optimistically removes the build, then confirms with the server', async () => {
      vi.mocked(api.fetchSaves).mockResolvedValue([mockBuild])
      vi.mocked(api.deleteSave).mockResolvedValue(undefined)

      const { result } = renderHook(() => useSaves())
      await waitFor(() => expect(result.current.builds).toHaveLength(1))

      await act(async () => {
        await result.current.deleteSave(mockBuild.id)
      })

      expect(result.current.builds).toEqual([])
      expect(api.deleteSave).toHaveBeenCalledWith(mockBuild.id)
    })

    it('restores the build if the server delete fails', async () => {
      vi.mocked(api.fetchSaves).mockResolvedValue([mockBuild])
      vi.mocked(api.deleteSave).mockRejectedValue(new Error('forbidden'))

      const { result } = renderHook(() => useSaves())
      await waitFor(() => expect(result.current.builds).toHaveLength(1))

      await act(async () => {
        await expect(result.current.deleteSave(mockBuild.id)).rejects.toThrow()
      })

      expect(result.current.builds).toEqual([mockBuild])
    })
  })
})
