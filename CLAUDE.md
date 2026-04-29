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
