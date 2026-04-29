import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchSaves, createSave, deleteSave } from './saves.api'
import { supabase } from '../../lib/supabase'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: { getUser: vi.fn() },
    from: vi.fn(),
  },
}))

const mockUser = { id: 'user-1' }

describe('saves.api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    } as never)
  })

  describe('fetchSaves', () => {
    it('returns mapped domain objects', async () => {
      const row = {
        id: 'b1', user_id: 'user-1', name: 'rig',
        components: { cpu: { name: 'Ryzen', price: 449 } },
        total_price: 449, created_at: '2026-01-15T10:00:00Z',
      }
      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [row], error: null }),
        }),
      })
      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as never)

      const result = await fetchSaves()

      expect(result).toEqual([{
        id: 'b1', userId: 'user-1', name: 'rig',
        components: { cpu: { name: 'Ryzen', price: 449 } },
        totalPrice: 449, createdAt: '2026-01-15T10:00:00Z',
      }])
    })
  })

  describe('createSave', () => {
    it('throws when there is no authenticated user', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: null,
      } as never)

      await expect(
        createSave({ name: 'x', components: { cpu: { name: 'c', price: 1 } } })
      ).rejects.toThrow(/not authenticated/i)
    })

    it('computes total_price from components before insert', async () => {
      const insertMock = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'b1', user_id: 'user-1', name: 'rig',
              components: {}, total_price: 1048,
              created_at: '2026-01-15T10:00:00Z',
            },
            error: null,
          }),
        }),
      })
      vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as never)

      await createSave({
        name: 'rig',
        components: {
          cpu: { name: 'Ryzen', price: 449 },
          gpu: { name: 'RTX', price: 599 },
        },
      })

      expect(insertMock).toHaveBeenCalledWith(
        expect.objectContaining({ total_price: 1048, user_id: 'user-1' })
      )
    })
  })

  describe('deleteSave', () => {
    it('surfaces Supabase errors as exceptions', async () => {
      const eqMock = vi.fn().mockResolvedValue({ error: { message: 'rls' } })
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
      vi.mocked(supabase.from).mockReturnValue({ delete: deleteMock } as never)

      await expect(deleteSave('build-1')).rejects.toThrow('rls')
    })
  })
})
