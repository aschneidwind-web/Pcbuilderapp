import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createElement } from 'react'
import { BuildProvider, useBuild } from './BuildContext'
import type { CatalogOption } from './build.types'

const wrapper = ({ children }: { children: React.ReactNode }) =>
  createElement(BuildProvider, null, children)

const ryzen: CatalogOption    = { n: 'Ryzen 7 7800X3D', s: '8-core · AM5',     p: 449, sk: 'AM5',     pm: 33180 }
const intel: CatalogOption    = { n: 'Core i5-14600K',  s: '14-core · LGA1700',p: 289, sk: 'LGA1700', pm: 28900 }
const rtx: CatalogOption      = { n: 'RTX 4070 Super',  s: '12GB · 1440p',     p: 599, pm: 28700 }
const am5Board: CatalogOption    = { n: 'ASUS ROG B650E-F',   s: 'AM5 · ATX',     p: 299, sk: 'AM5'     }
const lga1700Board: CatalogOption = { n: 'MSI PRO Z790-A WiFi', s: 'LGA1700 · ATX', p: 249, sk: 'LGA1700' }

describe('BuildProvider', () => {
  it('starts with an empty build', () => {
    const { result } = renderHook(() => useBuild(), { wrapper })
    expect(result.current.build).toEqual({})
    expect(result.current.totalPrice).toBe(0)
    expect(result.current.componentCount).toBe(0)
  })

  it('selectComponent sets the correct slot', () => {
    const { result } = renderHook(() => useBuild(), { wrapper })
    act(() => result.current.selectComponent('cpu', ryzen))
    expect(result.current.build.cpu).toBe(ryzen)
  })

  it('selectComponent replaces an existing selection', () => {
    const { result } = renderHook(() => useBuild(), { wrapper })
    act(() => result.current.selectComponent('cpu', ryzen))
    act(() => result.current.selectComponent('cpu', intel))
    expect(result.current.build.cpu).toBe(intel)
  })

  it('clearComponent removes the selection', () => {
    const { result } = renderHook(() => useBuild(), { wrapper })
    act(() => result.current.selectComponent('cpu', ryzen))
    act(() => result.current.clearComponent('cpu'))
    expect(result.current.build.cpu).toBeUndefined()
  })

  it('clearAll resets all slots', () => {
    const { result } = renderHook(() => useBuild(), { wrapper })
    act(() => { result.current.selectComponent('cpu', ryzen); result.current.selectComponent('gpu', rtx) })
    act(() => result.current.clearAll())
    expect(result.current.build).toEqual({})
  })

  it('totalPrice sums prices of selected components', () => {
    const { result } = renderHook(() => useBuild(), { wrapper })
    act(() => { result.current.selectComponent('cpu', ryzen); result.current.selectComponent('gpu', rtx) })
    expect(result.current.totalPrice).toBe(449 + 599)
  })

  it('componentCount tracks selected slots', () => {
    const { result } = renderHook(() => useBuild(), { wrapper })
    act(() => { result.current.selectComponent('cpu', ryzen); result.current.selectComponent('gpu', rtx) })
    expect(result.current.componentCount).toBe(2)
  })

  describe('socketCompatible', () => {
    it('is null when neither CPU nor motherboard are selected', () => {
      const { result } = renderHook(() => useBuild(), { wrapper })
      expect(result.current.socketCompatible).toBeNull()
    })

    it('is null when only CPU is selected', () => {
      const { result } = renderHook(() => useBuild(), { wrapper })
      act(() => result.current.selectComponent('cpu', ryzen))
      expect(result.current.socketCompatible).toBeNull()
    })

    it('is true when CPU and motherboard sockets match', () => {
      const { result } = renderHook(() => useBuild(), { wrapper })
      act(() => {
        result.current.selectComponent('cpu', ryzen)         // AM5
        result.current.selectComponent('motherboard', am5Board)  // AM5
      })
      expect(result.current.socketCompatible).toBe(true)
    })

    it('is false when CPU and motherboard sockets differ', () => {
      const { result } = renderHook(() => useBuild(), { wrapper })
      act(() => {
        result.current.selectComponent('cpu', ryzen)               // AM5
        result.current.selectComponent('motherboard', lga1700Board) // LGA1700
      })
      expect(result.current.socketCompatible).toBe(false)
    })
  })

  describe('loadBuild', () => {
    it('matches saved component names to catalog options', () => {
      const { result } = renderHook(() => useBuild(), { wrapper })
      act(() => result.current.loadBuild({
        cpu: { name: 'Ryzen 7 7800X3D' },
        gpu: { name: 'RTX 4070 Super' },
      }))
      // Should resolve to the actual catalog objects
      expect(result.current.build.cpu?.n).toBe('Ryzen 7 7800X3D')
      expect(result.current.build.gpu?.n).toBe('RTX 4070 Super')
      expect(result.current.componentCount).toBe(2)
    })

    it('skips components not found in the catalog', () => {
      const { result } = renderHook(() => useBuild(), { wrapper })
      act(() => result.current.loadBuild({
        cpu: { name: 'Nonexistent CPU 9000X' },
      }))
      expect(result.current.build.cpu).toBeUndefined()
      expect(result.current.componentCount).toBe(0)
    })
  })
})
