# PartFlow — Claude Code Instructions

## CRITICAL RULES — READ BEFORE DOING ANYTHING

1. NEVER create worktrees. Do not run `git worktree add` under any circumstances.
2. NEVER restart the dev server. Expo fast-refreshes on file save.
3. Always work directly in C:\Users\Andrew\Documents\pc-builder
4. After every meaningful file change, run: `git save "description"` then `git push`
5. Before making any claim about file paths, component names, code structure, or what exists in the codebase — always read the file first. Never state structural facts from memory. If unsure, say so and read it.

## Source of Truth

- All code lives under `mobile/`. No other directory is active.
- Before referencing any file path, component name, or entry count — read the file first.
- Never assume a file exists, has been deleted, or contains specific content without reading it.

## Project Structure

### React Native Features (Mobile — Expo Router)
```
mobile/features/build/        ✅ Build tab
mobile/features/saves/        ✅ Saved builds tab
mobile/features/compare/      ✅ Compare tab
mobile/features/account/      ✅ Account tab
```

### Key File Locations
```
mobile/features/build/BuildScreen.tsx         ← main build screen (NOT BuildPage)
mobile/features/build/build.catalog.ts        ← parts catalog (~148 entries)
mobile/features/build/build.types.ts          ← CatalogOption, SlotKey, BuildState
mobile/features/build/build.compatibility.ts  ← checkSocketCompat, checkCoolerSocketCompat
mobile/features/build/BuildContext.tsx        ← useBuild, socketCompatible, coolerCompatible
mobile/features/build/ComponentPicker.tsx     ← part picker sheet
mobile/features/build/ComponentRow.tsx        ← row in build screen
mobile/app/_layout.tsx                        ← root layout + auth gate
mobile/app/(tabs)/_layout.tsx                 ← tab navigator
mobile/app/auth.tsx                           ← auth screen
mobile/context/AuthContext.tsx
mobile/lib/supabase.ts
mobile/theme.ts                               ← design tokens (colors, spacing, typography)
mobile/.env.local                             ← EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY
```

### Core App
- Auth gate and tab navigation live in `mobile/app/`
- Supabase client in `mobile/lib/supabase.ts`
- Design tokens in `mobile/theme.ts` — always use these, never hardcode colors or spacing

## Dev Server

Run from: `C:\Users\Andrew\Documents\pc-builder\mobile`
Command: `expo start` (then press `a` for Android, `i` for iOS, `w` for web)
Never restart it — Expo fast-refreshes on file save.

## Git Workflow

- Active branch: `dev`
- Stable branch: `main`
- Commit alias: `git save "message"`
- Always push to `dev`. Merge to `main` only when a feature is complete.

## Architecture

Four tabs (Build, Compare, Saves, Account) are React Native feature slices using Expo Router with Supabase backing. The old Vite/React web app has been fully deleted — do not reference it, do not create files outside `mobile/`.

## Quality Bar

This is a production app, not a prototype. Every change must:
- **Be scalable** — no localStorage, no hardcoded state
- **Be testable** — new logic gets unit tests before implementation
- **Be clean** — no TODO comments left in committed code without a GitHub issue
- **Match existing patterns** — read neighboring feature slices before inventing new ones

## General Coding Rules

- **Modularization:** Follow SRP. Keep functions and classes small.
- **Modern Idioms:** Use current React Native / TypeScript patterns. Functional components only.
- **No Placeholders:** Always provide complete, runnable code. Never say "X remains unchanged."
- **Return Early:** Prefer early returns to reduce nesting.

## Workflow & Iteration

- **TDD First:** Write unit tests before implementation for any new logic.
- **Read Before Edit:** Always read a file in full before modifying it.
- **Run tests after logic changes:** Fix all failures before moving to the next step.

## Error Handling & Security

- **Fail Fast:** Validate inputs early. No silent failures.
- **No Hardcoded Secrets:** Use environment variables. Never commit credentials.
- **Explicit Exceptions:** Use specific error types, not generic catch-all blocks.

## Response Style

- **Conciseness:** Be direct. No filler phrases.
- **Explain "Why," Not "What":** Comments explain non-obvious decisions, not what the code does.
