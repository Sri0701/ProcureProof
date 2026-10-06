# Procure Proof

Procure Proof will read Indian GST invoices, check every number against rules, and send only the doubtful fields to a person.

This repository is at Phase 0: a monorepo, environment checks, and a health endpoint. The client shows `API: ok` when `GET /api/health` succeeds. Invoice extraction, validation, and review are not built yet.

## Prerequisites

- Node.js 20 or newer (`node -v`). This machine may be on 22, which satisfies `.nvmrc`'s `>=20` engines field.
- npm 10

## Setup

```text
npm ci
copy .env.example .env
```

Fill every empty value in `.env`. The server exits on startup and lists anything missing or invalid. `JWT_SECRET` must be at least 32 characters. Gemini and Supabase keys stay on the server. Do not commit `.env`.

For a local health check only, placeholder values are enough if they pass the format checks (a URL for `SUPABASE_URL`, a non-empty Gemini key string, a 32-character JWT secret). Those placeholders do not call Gemini or Supabase. Replace them before any later phase that reads documents.

Port 5173 is often already taken on this machine, so the Vite app uses **5180** and the API uses **4010**.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | API and client together |
| `npm run typecheck` | TypeScript for shared, server, and client |
| `npm run lint` | ESLint |
| `npm test` | Vitest for shared and the health route |
| `npm run build` | Shared check, server bundle, client production build |
| `npm start` | Runs the built API (`node server/dist/index.js`) |

Open http://localhost:5180. The page should read **API: ok**.

`GET /api/health` and `GET /health` return `{ "ok": true, "time": "<ISO timestamp>" }` and do not touch a database.

## Deploy

Not deployed yet. The blueprints are in place:

- `render.yaml` builds the API and checks `/api/health`.
- `client/vercel.json` rewrites SPA routes to `index.html`.
- Set `VITE_API_URL` on Vercel to the Render origin, with no trailing slash.
- Set `FRONTEND_URL` on Render to the Vercel origin.
- Supabase schema and storage are part of a later phase. Phase 0 does not connect to them.

A free Render service sleeps when idle. After deploy, ping `/api/health` every few minutes if you need it awake for a demo.
