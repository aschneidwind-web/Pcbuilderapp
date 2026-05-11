# PartFlow Scraper Pipeline

Scrapes PCPartPicker → normalises → upserts into Supabase `public.parts`.

## Setup

```bash
cd scripts
npm install
```

## Required environment variables

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (bypasses RLS) |

Set them in your shell or a `.env` file loaded before running (e.g. via `dotenv-cli`).

## Step 1 — Scrape PCPartPicker

```bash
npx tsx scripts/scrape-parts.ts
```

Fetches all 8 categories, paginates through every page, and writes raw JSON to
`scripts/data/{slot}.json`. Adds 1–2.5 s random delays between requests.

Expected output (counts vary as PCPartPicker inventory changes):

```
Scraping cpu (/cpu/)
  p1… 20 parts (running: 20)
  p2… 20 parts (running: 40)
  …
  → 350 total cpu

Scraping cooler (/cpu-cooler/)
  …
Scraping complete.
```

## Step 2 — Apply the Supabase migration

Run `supabase/migrations/0006_parts_catalog.sql` in the Supabase SQL editor (or
via Supabase CLI) to create `public.parts` before importing.

## Step 3 — Import into Supabase

```bash
SUPABASE_URL=https://xxx.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=eyJ... \
npx tsx scripts/import-to-supabase.ts
```

Expected output:

```
Importing cpu… 350 rows
Importing cooler… 180 rows
Importing motherboard… 420 rows
Importing ram… 510 rows
Importing storage… 680 rows
Importing gpu… 290 rows
Importing psu… 260 rows
Importing case… 310 rows

--- Import summary ---
  cpu          350
  cooler       180
  motherboard  420
  ram          510
  storage      680
  gpu          290
  psu          260
  case         310
  TOTAL        3000
```

## Refresh cadence

Run both steps quarterly. PCPartPicker inventory changes slowly; daily refreshes
are unnecessary and risk rate-limiting.

## Notes

- Parts with no price are imported with `p = null` — they still appear in the app.
- Unparseable fields are stored as `null`; a single bad row never aborts the run.
- `scripts/data/` is git-ignored — commit only the scripts, not the scraped JSON.
