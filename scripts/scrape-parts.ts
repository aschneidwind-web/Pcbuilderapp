#!/usr/bin/env tsx
/**
 * Scrapes PCPartPicker product listings using a headless Chromium browser.
 * Playwright runs a real browser so Cloudflare challenges are handled automatically.
 *
 * Run: npx tsx scripts/scrape-parts.ts
 */
import { chromium } from 'playwright'
import type { Page } from 'playwright'
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

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const MAX_PAGES_PER_CATEGORY = 60

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
// Scrape a single paginated URL and extract product rows
// ---------------------------------------------------------------------------

interface PageResult {
  rows: Record<string, string>[]
  hasMore: boolean
}

async function scrapePage(page: Page, slug: string, pageNum: number): Promise<PageResult | null> {
  const url = `https://pcpartpicker.com/products/${slug}/?page=${pageNum}`
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 })

    // Wait for the product table — try both known selector variants
    await page.waitForSelector('table.xs-col-12, #products__table', { timeout: 15_000 })

    const result = await page.evaluate((): { rows: Record<string, string>[]; hasMore: boolean } => {
      const rows: Record<string, string>[] = []

      document.querySelectorAll('tr.tr__product').forEach(tr => {
        const fields: Record<string, string> = {}

        tr.querySelectorAll('td').forEach(td => {
          // Identify the field by the td__* class on the cell
          const tdClass = Array.from(td.classList).find(c => c.startsWith('td__'))
          if (!tdClass) return

          const key = tdClass.slice(4) // strip "td__"

          if (key === 'name') {
            // Name is in a nested <p> first, then first <a>, then raw text
            const p = td.querySelector('p')
            const a = td.querySelector('a')
            fields[key] = ((p ?? a ?? td).textContent ?? '').trim()
          } else if (key === 'price') {
            const text = td.textContent ?? ''
            const m = text.match(/\$([\d,]+\.?\d*)/)
            fields[key] = m ? m[1].replace(/,/g, '') : ''
          } else {
            const text = (td.textContent ?? '').trim()
            if (text) fields[key] = text
          }
        })

        if (fields['name']) rows.push(fields)
      })

      // Detect whether there is a next page.
      // PCPartPicker marks the "next" pagination button with class "next";
      // when it is the last page the element is absent or has class "disabled".
      const nextBtn = document.querySelector('.pagination .next:not(.disabled) a')
      const hasMore = nextBtn !== null

      return { rows, hasMore }
    })

    return result
  } catch (err) {
    console.error(`  [err] ${slug} p${pageNum}: ${err instanceof Error ? err.message : err}`)
    return null
  }
}

// ---------------------------------------------------------------------------
// Scrape one category (all pages)
// ---------------------------------------------------------------------------

async function scrapeCategory(
  page: Page,
  slot: string,
  slug: string,
): Promise<Record<string, string>[]> {
  console.log(`\nScraping ${slot} (/${slug}/)`)
  const all: Record<string, string>[] = []
  let consecutiveFails = 0

  for (let pageNum = 1; pageNum <= MAX_PAGES_PER_CATEGORY; pageNum++) {
    process.stdout.write(`  p${pageNum}…`)

    const result = await scrapePage(page, slug, pageNum)

    if (!result) {
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
    all.push(...result.rows)
    process.stdout.write(` ${result.rows.length} parts (running: ${all.length})\n`)

    if (!result.hasMore || result.rows.length === 0) break

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

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: USER_AGENT,
  })
  const page = await context.newPage()

  // Warm-up: visit the home page so Cloudflare can set cookies before we
  // hit any product endpoints.
  console.log('Warming up (pcpartpicker.com)…')
  await page.goto('https://pcpartpicker.com', { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await sleep(3_000)

  try {
    const slots = Object.keys(CATEGORIES)
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i]!
      const slug = CATEGORIES[slot]!

      const parts = await scrapeCategory(page, slot, slug)
      const outPath = path.join(DATA_DIR, `${slot}.json`)
      await fs.writeFile(outPath, JSON.stringify(parts, null, 2))
      console.log(`  Saved → ${outPath}`)

      // Pause between categories (skip after the last one)
      if (i < slots.length - 1) await sleep(3_000)
    }
  } finally {
    await browser.close()
  }

  console.log('\nScraping complete.')
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
