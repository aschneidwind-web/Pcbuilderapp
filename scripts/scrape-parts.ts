#!/usr/bin/env tsx
/**
 * Scrapes PCPartPicker via ScrapingBee (handles Cloudflare bypass).
 *
 * Required:  SCRAPINGBEE_API_KEY=<your key>
 * Debug:     DEBUG_SELECTOR=1  (fetches cpu p1, logs HTML + selector probe, no file write)
 *
 * Run: npx tsx scripts/scrape-parts.ts
 */
import axios, { AxiosError } from 'axios'
import * as cheerio from 'cheerio'
import * as fs from 'fs/promises'
import * as path from 'path'

// ---------------------------------------------------------------------------
// Config / env validation
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(__dirname, 'data')

const CATEGORIES: Record<string, string> = {
  cpu:         'cpu',
  cooler:      'cpu-cooler',
  motherboard: 'motherboard',
  ram:         'memory',
  storage:     'internal-hard-drive',
  gpu:         'video-card',
  psu:         'power-supply',
  case:        'case',
}

const MAX_PAGES_PER_CATEGORY = 60
const DEBUG = !!process.env['DEBUG_SELECTOR']

const rawKey = process.env['SCRAPINGBEE_API_KEY']
if (!rawKey) {
  console.error('Missing SCRAPINGBEE_API_KEY env var')
  process.exit(1)
}
const API_KEY: string = rawKey

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function randomDelay(): Promise<void> {
  return sleep(1000 + Math.floor(Math.random() * 1500))
}

// ---------------------------------------------------------------------------
// ScrapingBee fetch — returns the rendered HTML string for a URL
// ---------------------------------------------------------------------------

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await axios.get<string>('https://app.scrapingbee.com/api/v1/', {
      params: {
        api_key:       API_KEY,
        url,
        render_js:     true,
        premium_proxy: true,
        country_code:  'us',
      },
      timeout:      60_000,
      responseType: 'text',
    })
    return res.data
  } catch (err) {
    const e = err as AxiosError
    const status = e.response?.status
    console.error(`  [err] ScrapingBee ${url}: ${e.message}${status ? ` (HTTP ${status})` : ''}`)
    return null
  }
}

// ---------------------------------------------------------------------------
// Debug mode — probe selectors on cpu page 1, never writes files
// ---------------------------------------------------------------------------

async function runDebug(): Promise<void> {
  console.log('DEBUG_SELECTOR mode — fetching https://pcpartpicker.com/products/cpu/?page=1\n')

  const html = await fetchHtml('https://pcpartpicker.com/products/cpu/?page=1')
  if (!html) {
    console.error('Fetch failed. Verify SCRAPINGBEE_API_KEY is valid.')
    process.exit(1)
  }

  const $ = cheerio.load(html)

  const SELECTORS = [
    'table.xs-col-12',
    '#products__table',
    'tr.tr__product',
    '.td__name',
  ] as const

  console.log('=== SELECTOR PROBE ===')
  for (const sel of SELECTORS) {
    const count = $(sel).length
    console.log(`  ${sel.padEnd(26)} → ${count} match${count !== 1 ? 'es' : ''}`)
  }
  console.log('=== END PROBE ===\n')

  // Step 2: log first 2 rows of table.xs-col-12 so we can see exact td class names
  const tableRows = $('table.xs-col-12 tbody tr')
  console.log(`table.xs-col-12 tbody tr count: ${tableRows.length}\n`)

  if (tableRows.length > 0) {
    console.log('=== FIRST 2 ROW OUTER HTML ===')
    tableRows.slice(0, 2).each((i, tr) => {
      console.log(`\n--- Row ${i + 1} ---`)
      console.log($.html(tr))
    })
    console.log('\n=== END ROW HTML ===\n')

    // Also extract td__ classes from first row for quick summary
    const tdClasses: string[] = []
    $(tableRows.get(0)!).find('td').each((_, td) => {
      const cls = ($(td).attr('class') ?? '').split(/\s+/).find(c => c.startsWith('td__'))
      if (cls) tdClasses.push(cls)
    })
    console.log(`First row td__ classes: ${tdClasses.join(', ') || '(none)'}`)
  } else {
    // Fallback: try tr.tr__product directly in case table structure differs
    const legacyRows = $('tr.tr__product')
    console.log(`Fallback tr.tr__product count: ${legacyRows.length}`)
    if (legacyRows.length > 0) {
      console.log('\n=== FIRST ROW (tr.tr__product) OUTER HTML ===')
      console.log($.html(legacyRows.first()))
    }
  }
}

// ---------------------------------------------------------------------------
// Parse product rows and detect pagination from rendered HTML
// ---------------------------------------------------------------------------

interface PageResult {
  rows: Record<string, string>[]
  hasMore: boolean
}

function parseHtml(html: string): PageResult {
  const $ = cheerio.load(html)
  const rows: Record<string, string>[] = []

  // table.xs-col-12 is the confirmed product table selector
  const tableRows = $('table.xs-col-12 tbody tr')
  const selector = tableRows.length > 0 ? 'table.xs-col-12 tbody tr' : 'tr.tr__product'

  $(selector).each((_, tr) => {
    const fields: Record<string, string> = {}

    $(tr).find('td').each((_, td) => {
      const tdClass = ($(td).attr('class') ?? '')
        .split(/\s+/)
        .find(c => c.startsWith('td__'))
      if (!tdClass) return

      const key = tdClass.slice(4) // strip "td__"

      if (key === 'name') {
        fields[key] =
          $(td).find('p').first().text().trim() ||
          $(td).find('a').first().text().trim() ||
          $(td).text().trim()
      } else if (key === 'price') {
        const m = $(td).text().match(/\$([\d,]+\.?\d*)/)
        fields[key] = m ? m[1].replace(/,/g, '') : ''
      } else {
        const t = $(td).text().trim()
        if (t) fields[key] = t
      }
    })

    if (fields['name']) rows.push(fields)
  })

  const hasMore = $('.pagination .next:not(.disabled) a').length > 0

  return { rows, hasMore }
}

// ---------------------------------------------------------------------------
// Scrape one category across all pages
// ---------------------------------------------------------------------------

async function scrapeCategory(slot: string, slug: string): Promise<Record<string, string>[]> {
  console.log(`\nScraping ${slot} (/${slug}/)`)
  const all: Record<string, string>[] = []
  let consecutiveFails = 0

  for (let pageNum = 1; pageNum <= MAX_PAGES_PER_CATEGORY; pageNum++) {
    process.stdout.write(`  p${pageNum}…`)

    const url = `https://pcpartpicker.com/products/${slug}/?page=${pageNum}`
    const html = await fetchHtml(url)

    if (!html) {
      consecutiveFails++
      if (consecutiveFails >= 3) {
        process.stdout.write(' 3 consecutive failures, stopping\n')
        break
      }
      process.stdout.write(' retrying in 5s\n')
      await sleep(5_000)
      pageNum-- // retry same page
      continue
    }

    consecutiveFails = 0
    const { rows, hasMore } = parseHtml(html)
    all.push(...rows)
    process.stdout.write(` ${rows.length} parts (running: ${all.length})\n`)

    if (!hasMore || rows.length === 0) break

    await randomDelay()
  }

  console.log(`  → ${all.length} total ${slot}`)
  return all
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  if (DEBUG) {
    await runDebug()
    return
  }

  await fs.mkdir(DATA_DIR, { recursive: true })

  const slots = Object.keys(CATEGORIES)
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i]!
    const slug = CATEGORIES[slot]!

    const parts = await scrapeCategory(slot, slug)
    const outPath = path.join(DATA_DIR, `${slot}.json`)
    await fs.writeFile(outPath, JSON.stringify(parts, null, 2))
    console.log(`  Saved → ${outPath}`)

    if (i < slots.length - 1) await sleep(3_000)
  }

  console.log('\nScraping complete.')
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
