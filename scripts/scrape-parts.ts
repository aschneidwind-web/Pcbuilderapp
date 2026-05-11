#!/usr/bin/env tsx
/**
 * Scrapes PCPartPicker product listings using a headless Chromium browser.
 *
 * PCPartPicker sits behind Cloudflare. If your IP is on a block list, set:
 *   PLAYWRIGHT_PROXY=http://user:pass@host:port   (residential proxy)
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
const PROXY = process.env['PLAYWRIGHT_PROXY']

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function randomDelay(): Promise<void> {
  return sleep(1000 + Math.floor(Math.random() * 1500))
}

function isBlocked(text: string): boolean {
  return text.toLowerCase().includes('unavailable') ||
         text.toLowerCase().includes('access denied') ||
         text.toLowerCase().includes('cf-error')
}

// ---------------------------------------------------------------------------
// Fetch one paginated result set using PCPartPicker's AJAX endpoint.
// The call is made from inside the browser page so it carries the real
// Cloudflare session cookies established during warm-up.
// ---------------------------------------------------------------------------

interface PageResult {
  rows: Record<string, string>[]
  hasMore: boolean
}

async function fetchProductPage(
  page: Page,
  slug: string,
  pageNum: number,
): Promise<PageResult | null> {
  const fetchUrl = `https://pcpartpicker.com/products/${slug}/fetch/?page=${pageNum}&pp=50`

  try {
    const result = await page.evaluate(
      async (url: string): Promise<{ rows: Record<string, string>[]; hasMore: boolean } | null> => {
        // --- runs inside the browser ---
        let data: Record<string, unknown>
        try {
          const resp = await fetch(url, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Accept':           'application/json, text/javascript, */*; q=0.01',
              'Referer':          window.location.href,
            },
            credentials: 'include',
          })
          if (!resp.ok) return null
          data = await resp.json() as Record<string, unknown>
        } catch {
          return null
        }

        const res = (data['result'] ?? data) as Record<string, unknown>
        const html = res['html'] as string | undefined
        if (!html) return null

        // Wrap bare <tr> fragments so the browser parses them correctly
        const wrapped = html.trimStart().startsWith('<table')
          ? html
          : `<table><tbody>${html}</tbody></table>`

        const div = document.createElement('div')
        div.innerHTML = wrapped

        const rows: Record<string, string>[] = []
        div.querySelectorAll('tr.tr__product').forEach(tr => {
          const fields: Record<string, string> = {}

          tr.querySelectorAll('td').forEach(td => {
            const tdClass = Array.from(td.classList).find(c => c.startsWith('td__'))
            if (!tdClass) return

            const key = tdClass.slice(4) // strip "td__"

            if (key === 'name') {
              const p = td.querySelector('p')
              const a = td.querySelector('a')
              fields[key] = ((p ?? a ?? td).textContent ?? '').trim()
            } else if (key === 'price') {
              const m = (td.textContent ?? '').match(/\$([\d,]+\.?\d*)/)
              fields[key] = m ? m[1].replace(/,/g, '') : ''
            } else {
              const t = (td.textContent ?? '').trim()
              if (t) fields[key] = t
            }
          })

          if (fields['name']) rows.push(fields)
        })

        // is_more_pages is the explicit signal; fall back to count > 0
        const count = typeof res['count'] === 'number' ? res['count'] as number : -1
        const hasMore =
          res['is_more_pages'] === true ||
          (res['is_more_pages'] == null && count > 0)

        return { rows, hasMore }
      },
      fetchUrl,
    )

    return result
  } catch (err) {
    console.error(`  [err] ${slug} p${pageNum}: ${err instanceof Error ? err.message : err}`)
    return null
  }
}

// ---------------------------------------------------------------------------
// Scrape one category — land on the listing page first (establishes the
// correct Referer + session context), then paginate via AJAX.
// ---------------------------------------------------------------------------

async function scrapeCategory(
  page: Page,
  slot: string,
  slug: string,
): Promise<Record<string, string>[]> {
  console.log(`\nScraping ${slot} (/${slug}/)`)

  // Navigate to the listing page to establish session/Referer context
  try {
    await page.goto(
      `https://pcpartpicker.com/products/${slug}/`,
      { waitUntil: 'domcontentloaded', timeout: 30_000 },
    )
    await sleep(2_000)
  } catch (err) {
    console.error(`  [err] loading /${slug}/: ${err instanceof Error ? err.message : err}`)
    return []
  }

  const bodyText = await page.evaluate(() => document.body.innerText)
  if (isBlocked(bodyText)) {
    console.error(`  [blocked] ${slug}: Cloudflare block active — set PLAYWRIGHT_PROXY and retry`)
    return []
  }

  const all: Record<string, string>[] = []
  let consecutiveFails = 0

  for (let pageNum = 1; pageNum <= MAX_PAGES_PER_CATEGORY; pageNum++) {
    process.stdout.write(`  p${pageNum}…`)

    const result = await fetchProductPage(page, slug, pageNum)

    if (!result) {
      consecutiveFails++
      if (consecutiveFails >= 3) {
        process.stdout.write(' 3 consecutive failures, stopping\n')
        break
      }
      process.stdout.write(' retrying in 5s\n')
      await sleep(5_000)
      pageNum--
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

  if (PROXY) console.log(`Proxy: ${PROXY}`)

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled'],
    ...(PROXY ? { proxy: { server: PROXY } } : {}),
  })

  const context = await browser.newContext({
    viewport:  { width: 1280, height: 800 },
    userAgent: USER_AGENT,
  })

  // Minimal stealth: remove the webdriver flag and fake chrome.runtime
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined })
    const w = window as unknown as Record<string, unknown>
    if (!w['chrome']) w['chrome'] = { runtime: {} }
  })

  const page = await context.newPage()

  // Warm-up: establish cookies on the root domain
  console.log('Warming up (pcpartpicker.com)…')
  try {
    await page.goto('https://pcpartpicker.com', { waitUntil: 'networkidle', timeout: 60_000 })
  } catch {
    // networkidle can time out on long-polling pages; domcontentloaded is enough
    console.log('  (networkidle timeout — continuing)')
  }
  await sleep(5_000)

  // Fail fast if Cloudflare is blocking this IP
  const homeText = await page.evaluate(() => document.body.innerText)
  if (isBlocked(homeText)) {
    console.error('\nBLOCKED: PCPartPicker returned "unavailable" on the home page.')
    console.error('Cloudflare is blocking this IP/ASN.')
    console.error('Fix: set PLAYWRIGHT_PROXY=http://user:pass@host:port and retry.\n')
    await browser.close()
    process.exit(1)
  }

  try {
    const slots = Object.keys(CATEGORIES)
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i]!
      const slug = CATEGORIES[slot]!

      const parts = await scrapeCategory(page, slot, slug)
      const outPath = path.join(DATA_DIR, `${slot}.json`)
      await fs.writeFile(outPath, JSON.stringify(parts, null, 2))
      console.log(`  Saved → ${outPath}`)

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
