# PartFlow — Claude Code Instructions

## CRITICAL RULES — READ BEFORE DOING ANYTHING

1. NEVER create worktrees. Do not run git worktree add under any circumstances.
2. NEVER check if the server is running. It is. Always.
3. Always work directly in C:\Users\Andrew\Documents\pc-builder
4. After every meaningful file change, run: git save "description" then git push

## Project Structure

### React Native Features (Mobile — Expo Router)
mobile/features/build/        ✅ Build tab: component picker, build summary, quick score
mobile/features/saves/        ✅ Saved builds tab: list, load, delete builds
mobile/features/compare/      ✅ Compare tab: category picker, sort buttons, comparison cards (PM & price)
mobile/features/account/      ✅ Account tab: profile, edit profile → Supabase, password, settings, dark mode

### Core App
mobile/app/_layout.tsx        <- Root layout + auth gate
mobile/app/(tabs)/_layout.tsx <- Tab navigator: build, saves, compare, account
mobile/app/auth.tsx           <- Auth screen
mobile/context/AuthContext.tsx
mobile/lib/supabase.ts
mobile/.env.local              <- EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY
mobile/theme.ts                <- Design tokens (colors, spacing, typography)

## Dev Server

Run from: C:\Users\Andrew\Documents\pc-builder\mobile
Command: expo start (then press 'a' for Android, 'i' for iOS, 'w' for web)
Never restart it — Expo fast-refreshes on file save.

## Git Workflow

Active branch: dev
Stable branch: main
Commit alias: git save "message"
Always push to dev. Merge to main only when feature is complete.

## Architecture

Four tabs (Build, Compare, Saves, Account) are React Native feature slices using Expo Router with Supabase backing. The old Vite/React web app has been deleted — do not reference it.

## Quality Bar

This is a production app, not a prototype. Every change must:
- **Be scalable** — no localStorage for user data, no hardcoded state
- **Be testable** — new logic gets unit tests before implementation
- **Be clean** — no TODO comments left in committed code without a GitHub issue
- **Match existing patterns** — check neighboring feature slices before inventing new ones

## General Coding Rules
- **Modularization:** Follow the Single Responsibility Principle (SRP). Keep functions and classes small.
- **Modern Idioms:** Use the most current, officially recommended patterns for the language/framework (e.g., Python 3.12+ type hints, React functional components).
- **No Placeholders:** Always provide complete, runnable code blocks. Never say "X remains unchanged" unless it is a minor snippet for context.
- **Return Early:** Prefer the "return early" pattern to reduce nesting and improve readability.

## Workflow & Iteration
- **TDD First:** When asked for new logic, always propose or write the unit tests before the architectural impacts and edge cases.

## Error Handling & Security
- **Fail Fast:** Validate inputs and preconditions early. Prohibit silent failures.
- **No Hardcoded Secrets:** Never include API keys or credentials; use environment variables as placeholders.
- **Explicit Exceptions:** Use specific error types rather than generic catch-all blocks.

## Response Style
- **Conciseness:** Be direct. Skip "Great question!" or "I'd be happy to help."
- **Explain "Why," Not "What":** Use comments to explain non-obvious design decisions, not to restate what a line of code is doing.
