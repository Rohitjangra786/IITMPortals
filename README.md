# JAC Inspection Portal

A full-stack web application for conducting **Joint Assessment Committee (JAC)** inspections of existing institutes (Technical & Non-Technical courses) for **Guru Gobind Singh Indraprastha University (GGSIPU)** / Department of Higher Education, Govt. of NCT of Delhi — Academic Session **2026-27**.

It digitises the official JAC assessment report: committee members fill in every parameter, marks are **auto-scored** (including the Teacher-Student Ratio and Faculty Cadre Ratio formulas), percentages and category (A/B/C/D) are computed live, and a print-ready report can be exported to PDF.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Prisma 6** ORM with **SQLite** (file-based, zero external setup)
- Custom auth: **bcryptjs** password hashing + **jose** JWT sessions in an httpOnly cookie, route protection via `proxy.ts`
- **zod** for request validation

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
npm run db:push      # create the SQLite schema (dev.db)
npm run db:seed      # seed an admin user + a demo institute
npm run dev          # http://localhost:3000
```

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

| Script             | Purpose                                  |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the dev server                     |
| `npm run build`    | Production build (type-checks the app)   |
| `npm run start`    | Start the production server              |
| `npm run db:push`  | Sync the Prisma schema to SQLite         |
| `npm run db:seed`  | Seed admin user + demo institute         |
| `npm run db:reset` | Reset the DB and re-seed                 |

## Project layout

```
app/
  (app)/            authenticated area (nav + guard)
    dashboard/      overview + recent inspections
    institutes/     institute registry & detail
    inspections/    [id] editor + [id]/report print view
  api/              auth, institutes, inspections route handlers
  login, register   auth pages
components/
  sections/         one component per report section
  inspection-editor.tsx, report.tsx, ui.tsx, …
lib/
  scoring.ts        pure scoring engine (TS ratio, FCR, totals, category)
  jac-config.ts     parameter definitions, TS cases, NAAC grades
  types.ts          InspectionData and related types
  auth.ts, session.ts, prisma.ts, inspection.ts
prisma/
  schema.prisma, seed.ts
proxy.ts            route protection (Next.js 16 proxy convention)
```

## Scoring reference

The scoring engine in `lib/scoring.ts` implements the GGSIPU JAC guidelines verbatim and is validated against the worked example in the report (3-yr programme, 1 division of 60 students at 1:20 → K = 9, senior = 3, junior = 6; CRF = 2 → 100 marks; CRF = 8 → 0).
