#!/usr/bin/env tsx
/**
 * Reads scripts/data/*.json (produced by scrape-parts.ts), normalises each
 * row to the public.parts schema, and upserts into Supabase.
 *
 * Run: npx tsx scripts/import-to-supabase.ts
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs/promises'
import * as path from 'path'

// ---------------------------------------------------------------------------
// Supabase client
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env['SUPABASE_URL']
const SERVICE_KEY  = process.env['SUPABASE_SERVICE_ROLE_KEY']

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// ---------------------------------------------------------------------------
// DB row shape (mirrors public.parts columns)
// ---------------------------------------------------------------------------

interface PartRow {
  slot:        string
  n:           string
  s:           string
  p:           number | null
  sk?:         string | null
  pm?:         number | null
  mhz?:        number | null
  gb?:         number | null
  tb?:         number | null
  read?:       number | null
  watts?:      number | null
  feat?:       string | null
  vrs?:        number | null
  tdp?:        number | null
  cooler_type?: string | null
  sockets?:    string[] | null
  scraped_at:  string
}

// ---------------------------------------------------------------------------
// Shared parsing utilities
// ---------------------------------------------------------------------------

function parsePrice(raw: string | undefined): number | null {
  if (!raw) return null
  const n = parseFloat(raw.replace(/,/g, ''))
  return isFinite(n) && n > 0 ? n : null
}

function parseIntField(raw: string | undefined): number | null {
  if (!raw) return null
  const stripped = raw.replace(/[^\d.]/g, '')
  const n = parseInt(stripped, 10)
  return isFinite(n) && n > 0 ? n : null
}

function parseFloatField(raw: string | undefined): number | null {
  if (!raw) return null
  const stripped = raw.replace(/[^\d.]/g, '')
  const n = parseFloat(stripped)
  return isFinite(n) && n > 0 ? n : null
}

function compactSpec(...parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(' · ')
}

// ---------------------------------------------------------------------------
// Per-category normalisation
// ---------------------------------------------------------------------------

function normaliseCpu(raw: Record<string, string>, slot: string): PartRow | null {
  const name = raw['name']?.trim()
  if (!name) return null

  const socket  = raw['socket']?.trim() || null
  const cores   = raw['core_count']?.trim() || null
  const clock   = raw['performance_core_clock']?.replace(/\s*GHz/i, '').trim() || null
  const tdp     = parseIntField(raw['tdp'])

  const s = compactSpec(
    cores  ? `${cores}-core` : null,
    clock  ? `${clock}GHz`   : null,
    socket,
  ) || 'CPU'

  return {
    slot, n: name, s,
    p:   parsePrice(raw['price']),
    sk:  socket,
    tdp,
    scraped_at: new Date().toISOString(),
  }
}

function normaliseCooler(raw: Record<string, string>, slot: string): PartRow | null {
  const name = raw['name']?.trim()
  if (!name) return null

  // Determine air vs AIO by name
  const aioMatch = name.match(/(\d{3})\s*mm/i)
  const cooler_type: 'aio' | 'air' = aioMatch ? 'aio' : 'air'
  const radiatorSize = aioMatch ? aioMatch[1] : null

  const tdp = parseIntField(raw['tdp'])

  // Socket compatibility: may be in various fields
  const rawSockets =
    raw['socket_compatibility'] ||
    raw['compatibility']        ||
    raw['sockets']              ||
    raw['cpu_socket']           || ''

  const sockets = rawSockets
    ? rawSockets.split(/[,/]/).map(s => s.trim()).filter(Boolean)
    : null

  const s = cooler_type === 'aio'
    ? compactSpec(`AIO`, radiatorSize ? `${radiatorSize}mm` : null, tdp ? `${tdp}W TDP` : null)
    : compactSpec(`Air`, tdp ? `${tdp}W TDP` : null)

  return {
    slot, n: name, s,
    p:           parsePrice(raw['price']),
    tdp,
    cooler_type,
    sockets:     sockets?.length ? sockets : null,
    scraped_at:  new Date().toISOString(),
  }
}

function normaliseMotherboard(raw: Record<string, string>, slot: string): PartRow | null {
  const name = raw['name']?.trim()
  if (!name) return null

  const socket      = raw['socket']?.trim()      || null
  const formFactor  = raw['form_factor']?.trim()  || null
  const memoryType  = raw['memory_type']?.trim()  || null
  const chipset     = raw['chipset']?.trim()      || null

  const vrs = memoryType?.toUpperCase().includes('DDR5') ? 5
            : memoryType?.toUpperCase().includes('DDR4') ? 4
            : null

  const feat = compactSpec(chipset) || null

  const s = compactSpec(socket, memoryType, formFactor) || 'Motherboard'

  return {
    slot, n: name, s,
    p:    parsePrice(raw['price']),
    sk:   socket,
    vrs,
    feat,
    scraped_at: new Date().toISOString(),
  }
}

function normaliseRam(raw: Record<string, string>, slot: string): PartRow | null {
  const name = raw['name']?.trim()
  if (!name) return null

  // speed field e.g. "DDR5-6000" or "6000 MHz"
  const speedRaw  = raw['speed']?.trim() || ''
  const mhzMatch  = speedRaw.match(/(\d{4,5})/)
  const mhz       = mhzMatch ? parseInt(mhzMatch[1], 10) : null

  // modules field e.g. "2 x 16 GB" or "2x16GB"
  const modulesRaw = raw['modules']?.trim() || ''
  const modMatch   = modulesRaw.match(/(\d+)\s*[x×]\s*(\d+)\s*GB/i)
  const gb         = modMatch ? parseInt(modMatch[1], 10) * parseInt(modMatch[2], 10) : null

  const s = compactSpec(speedRaw || null, modulesRaw || null) || 'RAM'

  return {
    slot, n: name, s,
    p:   parsePrice(raw['price']),
    mhz,
    gb,
    scraped_at: new Date().toISOString(),
  }
}

function normaliseStorage(raw: Record<string, string>, slot: string): PartRow | null {
  const name = raw['name']?.trim()
  if (!name) return null

  const capacityRaw = raw['capacity']?.trim() || ''
  let tb: number | null = null

  const tbMatch = capacityRaw.match(/([\d.]+)\s*TB/i)
  const gbMatch = capacityRaw.match(/([\d.]+)\s*GB/i)
  if (tbMatch) {
    tb = parseFloat(tbMatch[1])
  } else if (gbMatch) {
    const gb = parseFloat(gbMatch[1])
    tb = isFinite(gb) ? Math.round(gb / 1000 * 100) / 100 : null
  }

  const storType  = raw['type']?.trim()      || null
  const iface     = raw['interface']?.trim() || null
  const readSpeed = parseIntField(raw['read_speed'] || raw['sequential_read'])

  const s = compactSpec(
    storType,
    iface,
    capacityRaw || null,
  ) || 'Storage'

  return {
    slot, n: name, s,
    p:    parsePrice(raw['price']),
    tb,
    read: readSpeed,
    scraped_at: new Date().toISOString(),
  }
}

function normaliseGpu(raw: Record<string, string>, slot: string): PartRow | null {
  const name = raw['name']?.trim()
  if (!name) return null

  // memory field e.g. "12 GB"
  const memRaw  = raw['memory']?.trim()      || ''
  const memType = raw['memory_type']?.trim() || raw['memory_type_2']?.trim() || ''

  const s = compactSpec(
    memRaw  ? `${memRaw}` : null,
    memType || null,
  ) || 'GPU'

  return {
    slot, n: name, s,
    p:   parsePrice(raw['price']),
    scraped_at: new Date().toISOString(),
  }
}

function normalisePsu(raw: Record<string, string>, slot: string): PartRow | null {
  const name = raw['name']?.trim()
  if (!name) return null

  const watts      = parseIntField(raw['wattage'])
  const efficiency = raw['efficiency']?.trim() || null
  const modular    = raw['modular']?.trim()    || null

  const s = compactSpec(
    watts ? `${watts}W` : null,
    efficiency ? `80+ ${efficiency}` : null,
    modular    ? `${modular} Modular` : null,
  ) || 'PSU'

  return {
    slot, n: name, s,
    p:     parsePrice(raw['price']),
    watts,
    scraped_at: new Date().toISOString(),
  }
}

function normaliseCase(raw: Record<string, string>, slot: string): PartRow | null {
  const name = raw['name']?.trim()
  if (!name) return null

  const caseType   = raw['type']?.trim()        || null
  const sidePanel  = raw['side_panel']?.trim()   || null
  const formFactor = raw['form_factor']?.trim()  || raw['mbd_form_factor']?.trim() || null

  const s = compactSpec(caseType, formFactor, sidePanel) || 'Case'

  return {
    slot, n: name, s,
    p:   parsePrice(raw['price']),
    scraped_at: new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

type Normaliser = (raw: Record<string, string>, slot: string) => PartRow | null

const NORMALISERS: Record<string, Normaliser> = {
  cpu:         normaliseCpu,
  cooler:      normaliseCooler,
  motherboard: normaliseMotherboard,
  ram:         normaliseRam,
  storage:     normaliseStorage,
  gpu:         normaliseGpu,
  psu:         normalisePsu,
  case:        normaliseCase,
}

// ---------------------------------------------------------------------------
// Upsert one category
// ---------------------------------------------------------------------------

const BATCH_SIZE = 200

async function upsertBatch(rows: PartRow[]): Promise<number> {
  const { error } = await supabase
    .from('parts')
    .upsert(rows, { onConflict: 'slot,n' })

  if (error) throw new Error(`Supabase upsert error: ${error.message}`)
  return rows.length
}

async function importCategory(slot: string): Promise<number> {
  const dataPath = path.join(__dirname, 'data', `${slot}.json`)

  let rawRows: Record<string, string>[]
  try {
    const text = await fs.readFile(dataPath, 'utf-8')
    rawRows = JSON.parse(text) as Record<string, string>[]
  } catch {
    console.warn(`  [skip] No data file for ${slot} at ${dataPath}`)
    return 0
  }

  const normaliser = NORMALISERS[slot]
  if (!normaliser) {
    console.warn(`  [skip] No normaliser for slot "${slot}"`)
    return 0
  }

  const parts: PartRow[] = []
  let skipped = 0
  for (const raw of rawRows) {
    const row = normaliser(raw, slot)
    if (row) parts.push(row)
    else skipped++
  }

  if (skipped > 0) console.log(`  [warn] ${skipped} rows skipped (no name)`)

  // Upsert in batches
  let total = 0
  for (let i = 0; i < parts.length; i += BATCH_SIZE) {
    total += await upsertBatch(parts.slice(i, i + BATCH_SIZE))
  }

  return total
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const slots = Object.keys(NORMALISERS)
  const counts: Record<string, number> = {}

  for (const slot of slots) {
    process.stdout.write(`Importing ${slot}…`)
    const n = await importCategory(slot)
    counts[slot] = n
    process.stdout.write(` ${n} rows\n`)
  }

  console.log('\n--- Import summary ---')
  let grand = 0
  for (const [slot, n] of Object.entries(counts)) {
    console.log(`  ${slot.padEnd(12)} ${n}`)
    grand += n
  }
  console.log(`  ${'TOTAL'.padEnd(12)} ${grand}`)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
