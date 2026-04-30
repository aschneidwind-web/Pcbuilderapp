# PC Builder — Claude Code Instructions

## CRITICAL RULES — READ BEFORE DOING ANYTHING

1. NEVER create worktrees. Do not run git worktree add under any circumstances.
2. NEVER run npm install or npm run dev. The dev server is already running.
3. NEVER check if the server is running. It is. Always.
4. Always work directly in C:\Users\Andrew\Documents\pc-builder
5. After every meaningful file change, run: git save "description" then git push

## Project Structure

app/src/legacy/prototype.html  <- MAIN APP — HTML structure + CSS
app/src/legacy/prototype.js    <- MAIN APP LOGIC — edit this for features
app/src/App.tsx                <- Phase machine: splash > auth > app
app/src/components/AuthScreen.tsx
app/src/components/SplashScreen.tsx
app/src/context/AuthContext.tsx
app/src/lib/supabase.ts
app/.env.local                 <- VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
index.html                     <- Standalone deployable version

## Dev Server

URL: http://localhost:5173
Running from: C:\Users\Andrew\Documents\pc-builder\app
Vite hot-reloads on file save. Never restart it.

## Git Workflow

Active branch: dev
Stable branch: main
Commit alias: git save "message"
Always push to dev. Merge to main only when feature is complete.

## Features

All app features (Build, Community, Compare, Saved, Account) are in prototype.html and prototype.js.
The React wrapper only handles splash screen and Supabase auth.

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
