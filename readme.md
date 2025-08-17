# Coinvo (BudgetChat) — Monorepo

Mobile-first, chat-powered expense tracker.
Frontend: Vite + React + TS + Tailwind v4
Backend: NestJS (REST) + Prisma + Supabase (Postgres)
AI parsing: Anthropic Chat Completions

## Prerequisites

- Node 22+
- npm 10+
- Supabase project (Postgres)
- Anthropic API key

## Project layout

.
├─ apps/
│ ├─ frontend/ # React + Vite + Tailwind v4
│ └─ backend/ # NestJS + Prisma + Anthropic
├─ package.json # npm workspaces and dev scripts
├─ package-lock.json # single lockfile at root
└─ .gitignore

## First-time setup (fresh clone)

1. Install dependencies for all workspaces
   npm ci
   (or: npm install)

2. Create environment files
   apps/backend/.env

   ***

   CLAUDE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

   # For Supabase: prefer the pooler with SSL (works behind IPv6-limited networks)

   # Example (replace host/user/password):

   DATABASE_URL=postgresql://postgres.USER:PASSWORD@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connection_limit=1

   ## apps/frontend/.env (optional for now)

   # Add FRONTEND envs if/when needed

3. (If the DB is empty) Push schema to Supabase and generate Prisma client
   cd apps/backend
   npx prisma db push
   npx prisma generate
   cd ../../

4. Run both apps together (from repo root)
   npm run dev
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## Useful commands

From repo root:

- npm run dev # start frontend + backend concurrently
- npm run dev:frontend # start only frontend
- npm run dev:backend # start only backend
- npm run build # build both apps
- npm run lint # run linters (each workspace)

Frontend (apps/frontend):

- npm run dev
- npm run build

Backend (apps/backend):

- npm run start:dev
- npx prisma studio # browse DB in a GUI (optional)
- npx prisma db push # sync schema to DB
- npx prisma generate # regenerate Prisma client

## Environment variables

apps/backend/.env

- CLAUDE_API_KEY -> Anthropic API key
- DATABASE_URL -> Postgres connection string
  Supabase pooler example:
  postgresql://postgres.USER:PASSWORD@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connection_limit=1

## Development notes

- CORS: backend allows http://localhost:5173
- Speech (Web Speech API): best in Chrome; Brave/Safari may restrict it
- Line endings: project prefers LF; set your editor accordingly
- Do NOT commit real .env files; keep .env in .gitignore

## Troubleshooting

- Prisma P1001 (can’t reach DB):
  - Ensure sslmode=require and use the Supabase pooler host/port 6543 if IPv6 is an issue.
  - Check password and that the project is fully initialized.

- Frontend can’t hit backend:
  - Backend must run on http://localhost:3000
  - Check CORS and that /parse endpoint returns JSON

- Formatting on save:
  - Use VSCode Prettier extension with "formatOnSave": true
  - Local prettier install is optional; CLI commands require it

## Roadmap (next)

- Persist parsed expenses via POST /expenses
- List expenses with date grouping (GET /expenses?from=&to=&limit=)
- Filters + insights charts
- Auth (Supabase) + Row Level Security
- PWA install banner and offline cache
