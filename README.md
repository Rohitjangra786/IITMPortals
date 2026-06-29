# JAC Inspection Portal

A full-stack web application for conducting **Joint Assessment Committee (JAC)** inspections of existing institutes (Technical & Non-Technical courses) for **Guru Gobind Singh Indraprastha University (GGSIPU)** / Department of Higher Education, Govt. of NCT of Delhi — Academic Session **2026-27**.

It digitises the official JAC assessment report: committee members fill in every parameter, marks are **auto-scored** (including the Teacher-Student Ratio and Faculty Cadre Ratio formulas), percentages and category (A/B/C/D) are computed live, and a print-ready report can be exported to PDF.

## Tech stack

- **Vite 6** + **React 19** + **React Router 7** + **TypeScript** (single-page app)
- **Express 4** + **TypeScript** API server (run with **tsx**)
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Prisma 6** ORM with **SQLite** (file-based, zero external setup)
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

`.env` (created on first setup):

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="<random 96-char hex>"
```

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

### Production

```bash
npm run build        # → dist/
npm run start        # Express serves dist/ and /api on http://localhost:3001
```

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
