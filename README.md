# JAC Inspection Portal

A full-stack web application for conducting **Joint Assessment Committee (JAC)** inspections of existing institutes (Technical & Non-Technical courses) for **Guru Gobind Singh Indraprastha University (GGSIPU)** / Department of Higher Education, Govt. of NCT of Delhi — Academic Session **2026-27**.

It digitises the official JAC assessment report: committee members fill in every parameter, marks are **auto-scored** (including the Teacher-Student Ratio and Faculty Cadre Ratio formulas), percentages and category (A/B/C/D) are computed live, and a print-ready report can be exported to PDF.

## Tech stack

- **Vite 6** + **React 19** + **React Router 7** + **TypeScript** (single-page app)
- **Express 4** + **TypeScript** API server (run with **tsx**)
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Prisma 6** ORM with **SQLite** locally and **Turso** (cloud libSQL) in
  production via the Prisma driver adapter — same schema both sides
- Deployable to **Vercel** (serverless API function + static SPA) or any Node host
- Custom auth: **bcryptjs** password hashing + **jose** JWT sessions in an httpOnly cookie; client-side route guards backed by `/api/auth/me`
- **zod** for request validation

> Originally built on Next.js 16; migrated to a Vite SPA + Express API split so
> the frontend builds with `vite build` and the backend is a standalone Node
> server.

## Features

- 🔐 Committee-member accounts (login / register, roles)
- 🏫 Institute registry (CRUD)
- 📋 Full inspection editor matching the official report:
  - Particulars & committee
  - Programmes (drives ratio scoring)
  - Part I — Physical Infrastructure (Yes/No, no marks)
  - Part II — Academic Standards (II-A … II-H, max marks per the report)
  - Part III — Compliance (200)
  - Recommendations (space/FAR, category, provisional affiliation)
- 🧮 **Live auto-scoring**
  - Teacher-Student Ratio — all 5 statutory cases (`50 + slope·(worst − t)`, capped/zeroed)
  - Faculty Cadre Ratio — `K = (S·N·D)/ratio`, CRF `f`, `50 + 10·(7 − f)`
  - Part II / Part III percentages and category (worse of the two parts)
- 💾 Debounced autosave
- 🖨️ Print / Save-as-PDF report view (A4 print styles)

## Getting started

```bash
npm install
npm run db:generate  # generate the Prisma client
npm run db:push      # create the SQLite schema (dev.db)
npm run db:seed      # seed an admin user + a demo institute
npm run dev          # Vite on http://localhost:5173, API on http://localhost:3001
```

`npm run dev` starts **both** the Vite dev server (frontend, port 5173) and the
Express API (port 3001) concurrently; Vite proxies `/api` to the API server.
Open **http://localhost:5173**.

### Default login (from the seed)

```
admin@iitmipu.ac.in  /  admin123
```

> Change this password in production, and set a strong `AUTH_SECRET` in `.env`.

## Environment

Copy `.env.example` to `.env`. For local development:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="<random 96-char hex>"
```

In production you also set `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` (see below).
When `TURSO_DATABASE_URL` is present the app uses Turso (cloud libSQL) via the
Prisma driver adapter; otherwise it uses the local SQLite file. The schema is
identical, so **nothing changes for local dev**.

> Sessions are issued as `Secure` cookies in production, so deploy behind **HTTPS**.

## Scripts

| Script               | Purpose                                                 |
| -------------------- | ------------------------------------------------------- |
| `npm run dev`        | Start Vite (frontend) + Express (API) together          |
| `npm run build`      | Type-check then build the SPA to `dist/`                |
| `npm run start`      | Run the production server (serves `dist/` + API)        |
| `npm run typecheck`  | Type-check the whole project (`tsc --noEmit`)           |
| `npm run db:generate`| Generate the Prisma client                              |
| `npm run db:push`    | Sync the Prisma schema to SQLite                        |
| `npm run db:seed`    | Seed admin user + demo institute                        |
| `npm run db:reset`   | Reset the DB and re-seed                                |

### Production (self-hosted)

```bash
npm run build        # → dist/
npm run start        # Express serves dist/ and /api on http://localhost:3001
```

## Deploying to Vercel (with Turso)

SQLite can't run on Vercel (serverless functions have no persistent disk), so
production uses **Turso** — a cloud database that speaks SQLite. The Express API
runs as a Vercel **serverless function** ([api/index.ts](api/index.ts) →
[server/app.ts](server/app.ts)) and Vercel serves the built SPA from `dist/`
([vercel.json](vercel.json) wires the routing).

**1. Create a Turso database from your local SQLite file** (imports the schema
and any seed data in one step):

```bash
npm run db:push                                    # ensure prisma/dev.db is current
turso db create iitm-portals --from-file prisma/dev.db
turso db show iitm-portals          # copy the libsql://... URL
turso db tokens create iitm-portals # copy the token
```

**2. Set Environment Variables in the Vercel project** (Settings → Environment
Variables):

| Variable             | Value                                   |
| -------------------- | --------------------------------------- |
| `TURSO_DATABASE_URL` | `libsql://your-db.turso.io`             |
| `TURSO_AUTH_TOKEN`   | the Turso token                         |
| `AUTH_SECRET`        | a long random string                    |

**3. Deploy** — push to GitHub and import the repo in Vercel (build command,
output dir and routing are already in `vercel.json`). No `DATABASE_URL` is
needed at runtime on Vercel; it's only used by the Prisma CLI locally.

> Until `TURSO_DATABASE_URL` is set, the site deploys and loads but API calls
> that hit the database will fail — connect Turso when you're ready.

## Project layout

```
index.html          Vite entry (loads Google Fonts + /src/main.tsx)
vite.config.ts      Vite config (React + Tailwind, /api dev proxy)
src/                 frontend (SPA)
  main.tsx          React root (BrowserRouter + AuthProvider)
  App.tsx           routes + auth guards + app layout
  auth.tsx          auth context (/api/auth/me, login state, logout)
  hooks/useResource.ts  JSON fetch hook (loading/error/reload)
  pages/            Login, Register, Dashboard, Institutes,
                    InstituteDetail, Inspection, Report, NotFound
  components/
    sections/       one component per report section
    inspection-editor.tsx, report.tsx, nav.tsx, ui.tsx, …
  lib/              shared pure logic (imported by both src and server)
    scoring.ts      pure scoring engine (TS ratio, FCR, totals, category)
    jac-config.ts   parameter definitions, TS cases, NAAC grades
    types.ts        InspectionData and related types
    inspection.ts   parse stored JSON / recompute summary columns
server/              Express API
  index.ts          app entry; mounts /api, serves dist/ in production
  lib/              prisma.ts, session.ts (jose JWT), auth.ts (bcrypt + cookies)
  routes/           auth.ts, institutes.ts, inspections.ts
prisma/
  schema.prisma, seed.ts
```

## Scoring reference

The scoring engine in `src/lib/scoring.ts` implements the GGSIPU JAC guidelines verbatim and is validated against the worked example in the report (3-yr programme, 1 division of 60 students at 1:20 → K = 9, senior = 3, junior = 6; CRF = 2 → 100 marks; CRF = 8 → 0).
