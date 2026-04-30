# PC Builder — Claude Code Instructions

## CRITICAL RULES — READ BEFORE DOING ANYTHING

1. NEVER create worktrees. Do not run git worktree add under any circumstances.
2. NEVER run npm install or npm run dev. The dev server is already running.
3. NEVER check if the server is running. It is. Always.
4. Always work directly in C:\Users\Andrew\Documents\pc-builder
5. After every meaningful file change, run: git save "description" then git push

## Project Structure

### React Features (Migrated)
app/src/features/build/       ✅ Build tab: component picker, build summary, quick score
app/src/features/saves/       ✅ Saved builds tab: list, load, delete builds
app/src/features/compare/     ✅ Compare tab: category picker, sort buttons, comparison cards (PM & price)
app/src/features/account/     ✅ Account tab: profile, edit profile → Supabase, password, settings, dark mode
app/src/features/community/   ✅ Community tab: builds feed, filters, post build, likes, comments, clone

### Core App
app/src/App.tsx               <- Routes: /build, /saves, /compare, /account + auth gate
app/src/context/AuthContext.tsx
app/src/lib/supabase.ts
app/.env.local                 <- VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY

### Legacy (Dead — do NOT edit, do NOT reference)
app/src/legacy/

## Dev Server

URL: http://localhost:5173
Running from: C:\Users\Andrew\Documents\pc-builder\app
Vite hot-reloads on file save. Never restart it.

## Git Workflow

Active branch: dev
Stable branch: main
Commit alias: git save "message"
Always push to dev. Merge to main only when feature is complete.

## Architecture

All five tabs (Build, Compare, Saves, Account, Community) are fully migrated to React feature slices with Supabase backing. Legacy prototype is dead—do not edit or reference it.

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
