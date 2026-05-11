#!/usr/bin/env tsx
/**
 * Scrapes PCPartPicker product listings and saves raw JSON to scripts/data/.
 * Uses the AJAX fetch endpoint that PCPartPicker's own pagination calls.
 *
 * Run: npx tsx scripts/scrape-parts.ts
 */
import axios, { AxiosError } from 'axios'
import * as cheerio from 'cheerio'
import type { Element } from 'domhandler'
import * as fs from 'fs/promises'
import * as path from 'path'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(__dirname, 'data')

/** Maps our slot key → PCPartPicker URL slug */
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

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
]

const MAX_PAGES_PER_CATEGORY = 60

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function randomDelay(): Promise<void> {
  return sleep(1000 + Math.floor(Math.random() * 1500))
}

// ---------------------------------------------------------------------------
// Fetch a single page via PCPartPicker's AJAX endpoint
// ---------------------------------------------------------------------------

interface FetchResult {
  html: string
  hasMore: boolean
}

async function fetchPage(slug: string, page: number): Promise<FetchResult | null> {
  const url = `https://pcpartpicker.com/products/${slug}/fetch/?page=${page}`
  try {
    const res = await axios.get<unknown>(url, {
      headers: {
        'User-Agent':       randomAgent(),
        'Accept':           'application/json, text/javascript, */*; q=0.01',
        'Accept-Language':  'en-US,en;q=0.9',
        'Referer':          `https://pcpartpicker.com/products/${slug}/`,
        'X-Requested-With': 'XMLHttpRequest',
      },
      timeout: 30_000,
    })

    const data = res.data as Record<string, unknown>
    const result = data?.result as Record<string, unknown> | undefined
    const html = result?.html as string | undefined

    if (!html) {
      console.warn(`  [warn] No result.html for ${slug} p${page}`)
      return null
    }

    // hasMore: explicit flag, or fall back to non-empty count
    const isMorePages = result?.is_more_pages
    const count = typeof result?.count === 'number' ? result.count : -1
    const hasMore = typeof isMorePages === 'boolean' ? isMorePages : count !== 0

    return { html, hasMore }
  } catch (err) {
    const e = err as AxiosError
    const status = e.response?.status
    console.error(`  [err] ${slug} p${page}: ${e.message}${status ? ` (HTTP ${status})` : ''}`)
    return null
  }
}

// ---------------------------------------------------------------------------
// Parse product rows from table HTML (may be full table or just <tr> nodes)
// ---------------------------------------------------------------------------

function extractRowFields($: cheerio.CheerioAPI, row: Element): Record<string, string> {
  const fields: Record<string, string> = {}

  $(row).find('td').each((_, td) => {
    const cls = $(td).attr('class') ?? ''
    const matches = cls.match(/\btd__(\w+)/g)
    if (!matches) return

    for (const m of matches) {
      const key = m.replace('td__', '')

      if (key === 'name') {
        // Name lives in a nested <p> or the first <a>
        const text =
          $(td).find('p').first().text().trim() ||
          $(td).find('a').first().text().trim() ||
          $(td).text().trim()
        fields[key] = text
      } else if (key === 'price') {
        const priceText = $(td).text()
        const priceMatch = priceText.match(/\$([\d,]+\.?\d*)/)
        fields[key] = priceMatch ? priceMatch[1].replace(/,/g, '') : ''
      } else {
        const text = $(td).text().trim()
        if (text) fields[key] = text
      }
    }
  })

  return fields
}

function parseRows(html: string): Record<string, string>[] {
  // html may be full table HTML or just <tr> fragments — wrap defensively
  const wrapped = html.trimStart().startsWith('<table') ? html : `<table><tbody>${html}</tbody></table>`
  const $ = cheerio.load(wrapped)
  const rows: Record<string, string>[] = []

  $('tr.tr__product').each((_, tr) => {
    const fields = extractRowFields($, tr)
    if (fields['name']) rows.push(fields)
  })

  return rows
}

// ---------------------------------------------------------------------------
// Scrape one category (all pages)
// ---------------------------------------------------------------------------

async function scrapeCategory(slot: string, slug: string): Promise<Record<string, string>[]> {
  console.log(`\nScraping ${slot} (/${slug}/)`)
  const all: Record<string, string>[] = []
  let consecutiveFails = 0

  for (let page = 1; page <= MAX_PAGES_PER_CATEGORY; page++) {
    process.stdout.write(`  p${page}…`)

    const result = await fetchPage(slug, page)

    if (!result) {
      consecutiveFails++
      if (consecutiveFails >= 3) {
        process.stdout.write(' 3 consecutive failures, stopping\n')
        break
      }
      process.stdout.write(' retrying in 5s\n')
      await sleep(5_000)
      page-- // retry same page
      continue
    }

    consecutiveFails = 0
    const rows = parseRows(result.html)
    all.push(...rows)
    process.stdout.write(` ${rows.length} parts (running: ${all.length})\n`)

    if (!result.hasMore || rows.length === 0) break

    await randomDelay()
  }

  console.log(`  → ${all.length} total ${slot}`)
  return all
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })

  const slots = Object.keys(CATEGORIES)
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i]!
    const slug = CATEGORIES[slot]!

    const parts = await scrapeCategory(slot, slug)
    const outPath = path.join(DATA_DIR, `${slot}.json`)
    await fs.writeFile(outPath, JSON.stringify(parts, null, 2))
    console.log(`  Saved → ${outPath}`)

    // Pause between categories (except after the last one)
    if (i < slots.length - 1) await sleep(3_000)
  }

  console.log('\nScraping complete.')
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
