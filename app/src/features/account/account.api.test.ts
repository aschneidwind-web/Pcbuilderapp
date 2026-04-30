import { describe, it, expect } from 'vitest'
import { mapProfileRow } from './account.api'

describe('mapProfileRow', () => {
  it('maps a complete row', () => {
    const row = { id: 'u1', username: 'andrew', bio: 'builder', avatar_idx: 3, created_at: '2024-01-01T00:00:00Z' }
    expect(mapProfileRow(row)).toEqual({
      id: 'u1', username: 'andrew', bio: 'builder', avatarIdx: 3, createdAt: '2024-01-01T00:00:00Z',
    })
  })

  it('defaults bio to empty string when null', () => {
    const row = { id: 'u1', username: 'andrew', bio: null, avatar_idx: 0, created_at: '2024-01-01T00:00:00Z' }
    expect(mapProfileRow(row).bio).toBe('')
  })

  it('defaults avatarIdx to 0 when null', () => {
    const row = { id: 'u1', username: 'andrew', bio: null, avatar_idx: null, created_at: '2024-01-01T00:00:00Z' }
    expect(mapProfileRow(row).avatarIdx).toBe(0)
  })
})
