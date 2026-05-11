import assert from 'node:assert/strict'
import { checkCoolerSocketCompat, checkSocketCompat } from './build.compatibility.ts'
import type { CatalogOption } from './build.types.ts'

const cpu = (sk?: string): CatalogOption => ({ n: 'Test CPU', s: '', p: 0, sk })
const cooler = (sockets?: string[]): CatalogOption => ({ n: 'Test Cooler', s: '', p: 0, sockets })
const mb = (sk?: string): CatalogOption => ({ n: 'Test MB', s: '', p: 0, sk })

let passed = 0
let failed = 0

function test(name: string, fn: () => void) {
  try {
    fn()
    console.log(`  ✓ ${name}`)
    passed++
  } catch (e: any) {
    console.error(`  ✗ ${name}: ${e.message}`)
    failed++
  }
}

console.log('\ncoolerSocketCompat')
test('returns null when cpu has no sk', () => {
  assert.equal(checkCoolerSocketCompat(cooler(['AM4', 'AM5']), cpu()), null)
})
test('returns null when cooler has no sockets array', () => {
  assert.equal(checkCoolerSocketCompat(cooler(), cpu('AM4')), null)
})
test('returns true when cpu.sk is in cooler.sockets', () => {
  assert.equal(checkCoolerSocketCompat(cooler(['AM4', 'AM5', 'LGA1700']), cpu('AM5')), true)
})
test('returns false when cpu.sk is NOT in cooler.sockets', () => {
  assert.equal(checkCoolerSocketCompat(cooler(['AM4', 'AM5']), cpu('LGA1700')), false)
})

console.log('\ncheckSocketCompat')
test('returns null when cpu has no sk', () => {
  assert.equal(checkSocketCompat(cpu(), mb('AM4')), null)
})
test('returns null when motherboard has no sk', () => {
  assert.equal(checkSocketCompat(cpu('AM4'), mb()), null)
})
test('returns true when sockets match', () => {
  assert.equal(checkSocketCompat(cpu('AM5'), mb('AM5')), true)
})
test('returns false when sockets do not match', () => {
  assert.equal(checkSocketCompat(cpu('AM4'), mb('LGA1700')), false)
})

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
