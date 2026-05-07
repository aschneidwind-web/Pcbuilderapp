import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { CatalogProvider, useCatalog } from './CatalogContext'
import { CATALOG } from './build.catalog'
import { SLOT_KEYS } from './build.types'

// Mock the prices module so we don't hit Supabase in tests
vi.mock('./prices', () => ({
  fetchAndMergePrices: vi.fn(),
}))

import { fetchAndMergePrices } from './prices'
const mockFetch = vi.mocked(fetchAndMergePrices)

const wrapper = ({ children }: { children: React.ReactNode }) =>
  createElement(CatalogProvider, null, children)

const totalParts = SLOT_KEYS.reduce((sum, k) => sum + CATALOG[k].opts.length, 0)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('CatalogProvider', () => {
  it('starts in loading state with hardcoded catalog as default', () => {
    mockFetch.mockReturnValue(new Promise(() => {})) // never resolves
    const { result } = renderHook(() => useCatalog(), { wrapper })
    expect(result.current.loading).toBe(true)
    expect(result.current.catalog).toBe(CATALOG)
    expect(result.current.error).toBeNull()
  })

  it('provides the merged catalog after successful fetch', async () => {
    const fakeCatalog = { ...CATALOG }
    mockFetch.mockResolvedValue({
      catalog: fakeCatalog,
      staleCount: 2,
      fetchedAt: new Date('2025-06-01'),
    })

    const { result } = renderHook(() => useCatalog(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.catalog).toBe(fakeCatalog)
    expect(result.current.staleCount).toBe(2)
    expect(result.current.fetchedAt).toEqual(new Date('2025-06-01'))
    expect(result.current.error).toBeNull()
  })

  it('falls back to hardcoded catalog on fetch error', async () => {
    mockFetch.mockRejectedValue(new Error('Network down'))

    const { result } = renderHook(() => useCatalog(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.catalog).toBe(CATALOG) // unchanged default
    expect(result.current.error).toBe('Network down')
    expect(result.current.staleCount).toBe(totalParts)
  })

  it('refetch triggers a new price fetch', async () => {
    let callCount = 0
    mockFetch.mockImplementation(() => {
      callCount++
      return Promise.resolve({
        catalog: CATALOG,
        staleCount: 0,
        fetchedAt: new Date(),
      })
    })

    const { result } = renderHook(() => useCatalog(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(callCount).toBe(1)

    act(() => result.current.refetch())

    await waitFor(() => expect(callCount).toBe(2))
  })

  it('handles non-Error rejection gracefully', async () => {
    mockFetch.mockRejectedValue('string error')

    const { result } = renderHook(() => useCatalog(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Unknown price fetch error')
  })
})
